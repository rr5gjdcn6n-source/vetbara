create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'vetbara_role') then
    create type public.vetbara_role as enum ('admin', 'centre', 'examiner', 'candidate');
  end if;
end $$;

create table if not exists public.centres (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.examiners (
  id uuid primary key default gen_random_uuid(),
  centre_id uuid not null references public.centres(id) on delete cascade,
  code text not null unique,
  full_name text not null,
  birth_date date,
  registration_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.candidates (
  id uuid primary key default gen_random_uuid(),
  centre_id uuid not null references public.centres(id) on delete cascade,
  code text not null unique,
  full_name text not null,
  birth_date date,
  document_id text,
  level text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.qr_tokens (
  token text primary key,
  role public.vetbara_role not null,
  centre_id uuid references public.centres(id) on delete cascade,
  examiner_id uuid references public.examiners(id) on delete cascade,
  candidate_id uuid references public.candidates(id) on delete cascade,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint qr_tokens_role_subject_guard check (
    (role = 'centre' and centre_id is not null and examiner_id is null and candidate_id is null) or
    (role = 'examiner' and centre_id is not null and examiner_id is not null and candidate_id is null) or
    (role = 'candidate' and centre_id is not null and examiner_id is null and candidate_id is not null)
  )
);

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  session_key uuid not null unique,
  role public.vetbara_role not null,
  centre_id uuid references public.centres(id) on delete cascade,
  examiner_id uuid references public.examiners(id) on delete cascade,
  candidate_id uuid references public.candidates(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_centres_updated_at on public.centres;
create trigger set_centres_updated_at before update on public.centres for each row execute function public.set_updated_at();

drop trigger if exists set_examiners_updated_at on public.examiners;
create trigger set_examiners_updated_at before update on public.examiners for each row execute function public.set_updated_at();

drop trigger if exists set_candidates_updated_at on public.candidates;
create trigger set_candidates_updated_at before update on public.candidates for each row execute function public.set_updated_at();

drop trigger if exists set_qr_tokens_updated_at on public.qr_tokens;
create trigger set_qr_tokens_updated_at before update on public.qr_tokens for each row execute function public.set_updated_at();
