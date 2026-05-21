const REQUIRED_ENV = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"];

export function getMissingEnv(extra = []) {
  return [...REQUIRED_ENV, ...extra].filter((key) => !process.env[key]);
}

export function requireEnv(extra = []) {
  const missing = getMissingEnv(extra);
  if (missing.length > 0) {
    const error = new Error(`Missing env vars: ${missing.join(", ")}`);
    error.code = "missing_env";
    error.missing = missing;
    throw error;
  }

  return {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    seedSharedSecret: process.env.SEED_SHARED_SECRET || null
  };
}
