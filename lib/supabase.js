import { requireEnv } from "./env.js";

function headers(prefer = "return=representation") {
  const { supabaseServiceRoleKey } = requireEnv();
  return {
    apikey: supabaseServiceRoleKey,
    Authorization: `Bearer ${supabaseServiceRoleKey}`,
    "Content-Type": "application/json",
    Prefer: prefer
  };
}

function url(path, params = {}) {
  const { supabaseUrl } = requireEnv();
  const target = new URL(`/rest/v1/${path}`, supabaseUrl);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      target.searchParams.set(key, value);
    }
  });
  return target;
}

async function unwrap(response) {
  if (response.ok) {
    if (response.status === 204) return null;
    return response.json();
  }

  let details = null;
  try {
    details = await response.json();
  } catch {
    details = { message: await response.text() };
  }
  const error = new Error(`Supabase request failed with ${response.status}`);
  error.code = "supabase_request_failed";
  error.status = response.status;
  error.details = details;
  throw error;
}

export async function selectOne(table, filters) {
  const params = { select: "*" };
  Object.entries(filters).forEach(([key, value]) => {
    params[key] = `eq.${value}`;
  });
  const response = await fetch(url(table, params), {
    headers: headers()
  });
  const rows = await unwrap(response);
  return rows?.[0] ?? null;
}

export async function upsertRows(table, rows, onConflict) {
  const response = await fetch(url(table, onConflict ? { on_conflict: onConflict } : {}), {
    method: "POST",
    headers: headers("return=representation,resolution=merge-duplicates"),
    body: JSON.stringify(rows)
  });
  return unwrap(response);
}

export async function insertRow(table, row) {
  const response = await fetch(url(table), {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(row)
  });
  const rows = await unwrap(response);
  return rows?.[0] ?? null;
}
