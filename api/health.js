import { getMissingEnv } from "../lib/env.js";
import { json, methodNotAllowed } from "../lib/http.js";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return methodNotAllowed(res, ["GET"]);
  }

  return json(res, 200, {
    ok: true,
    service: "vetbara-api",
    timestamp: new Date().toISOString(),
    checks: {
      envConfigured: getMissingEnv().length === 0
    }
  });
}
