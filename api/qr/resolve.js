import { json, methodNotAllowed } from "../../lib/http.js";
import { selectOne } from "../../lib/supabase.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return methodNotAllowed(res, ["GET"]);
  }

  try {
    const token = req.query?.token || new URL(req.url, "http://localhost").searchParams.get("token");
    if (!token) {
      return json(res, 400, { ok: false, error: "missing_token" });
    }

    const record = await selectOne("qr_tokens", { token, is_active: "true" });
    if (!record) {
      return json(res, 404, { ok: false, error: "invalid_token" });
    }

    return json(res, 200, {
      ok: true,
      role: record.role,
      centreId: record.centre_id,
      examinerId: record.examiner_id,
      candidateId: record.candidate_id
    });
  } catch (error) {
    return json(res, 500, {
      ok: false,
      error: error.code || "qr_resolve_failed",
      message: error.message,
      details: error.details || null
    });
  }
}
