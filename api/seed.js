import crypto from "node:crypto";
import { requireEnv } from "../lib/env.js";
import { json, methodNotAllowed } from "../lib/http.js";
import { upsertRows } from "../lib/supabase.js";

const CENTRE_ID = "11111111-1111-1111-1111-111111111111";
const EXAMINER_ID = "22222222-2222-2222-2222-222222222222";
const CANDIDATE_ID = "33333333-3333-3333-3333-333333333333";

function checkSeedSecret(req, expected) {
  if (!expected) return;
  if (req.headers["x-seed-secret"] !== expected) {
    const error = new Error("Missing or invalid x-seed-secret header");
    error.code = "forbidden";
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return methodNotAllowed(res, ["POST"]);
  }

  try {
    const { seedSharedSecret } = requireEnv();
    checkSeedSecret(req, seedSharedSecret);
    const timestamp = new Date().toISOString();

    await upsertRows("centres", [{
      id: CENTRE_ID,
      code: "DEMO-CENTRE",
      name: "Demo Certification Centre",
      updated_at: timestamp
    }], "id");

    await upsertRows("examiners", [{
      id: EXAMINER_ID,
      centre_id: CENTRE_ID,
      code: "DEMO-EXAMINER",
      full_name: "Demo Examiner",
      birth_date: "1982-05-14",
      registration_id: "EX-CZ-001",
      updated_at: timestamp
    }], "id");

    await upsertRows("candidates", [{
      id: CANDIDATE_ID,
      centre_id: CENTRE_ID,
      code: "DEMO-CANDIDATE",
      full_name: "Demo Candidate",
      birth_date: "1981-04-12",
      document_id: "CZ-458921",
      level: "Consulting",
      updated_at: timestamp
    }], "id");

    const qrTokens = [
      { token: "demo-centre-qr", role: "centre", centre_id: CENTRE_ID, examiner_id: null, candidate_id: null, is_active: true, updated_at: timestamp },
      { token: "demo-examiner-qr", role: "examiner", centre_id: CENTRE_ID, examiner_id: EXAMINER_ID, candidate_id: null, is_active: true, updated_at: timestamp },
      { token: "demo-candidate-qr", role: "candidate", centre_id: CENTRE_ID, examiner_id: null, candidate_id: CANDIDATE_ID, is_active: true, updated_at: timestamp }
    ];

    await upsertRows("qr_tokens", qrTokens, "token");

    return json(res, 200, {
      ok: true,
      seedRunId: crypto.randomUUID(),
      tokens: qrTokens.map(({ token, role }) => ({ token, role }))
    });
  } catch (error) {
    return json(res, error.code === "forbidden" ? 403 : 500, {
      ok: false,
      error: error.code || "seed_failed",
      message: error.message,
      missing: error.missing || null,
      details: error.details || null
    });
  }
}
