import crypto from "node:crypto";
import { json, methodNotAllowed } from "../../lib/http.js";
import { insertRow, selectOne } from "../../lib/supabase.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return methodNotAllowed(res, ["POST"]);
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const { token } = body;

    if (!token) {
      return json(res, 400, { ok: false, error: "missing_token" });
    }

    const record = await selectOne("qr_tokens", { token, is_active: "true" });
    if (!record) {
      return json(res, 404, { ok: false, error: "invalid_token" });
    }

    const sessionKey = crypto.randomUUID();
    const session = await insertRow("sessions", {
      session_key: sessionKey,
      role: record.role,
      centre_id: record.centre_id,
      examiner_id: record.examiner_id,
      candidate_id: record.candidate_id
    });

    return json(res, 200, {
      ok: true,
      sessionKey,
      role: session.role,
      centreId: session.centre_id,
      examinerId: session.examiner_id,
      candidateId: session.candidate_id
    });
  } catch (error) {
    return json(res, 500, {
      ok: false,
      error: error.code || "session_bootstrap_failed",
      message: error.message,
      details: error.details || null
    });
  }
}
