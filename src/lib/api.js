const API_BASE = (import.meta.env && import.meta.env.VITE_API_BASE_URL) || "";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.message || data.error || "request_failed");
    error.payload = data;
    throw error;
  }
  return data;
}

export function resolveQrToken(token) {
  return request(`/api/qr/resolve?token=${encodeURIComponent(token)}`);
}

export function bootstrapSession(token) {
  return request("/api/session/bootstrap", {
    method: "POST",
    body: JSON.stringify({ token })
  });
}
