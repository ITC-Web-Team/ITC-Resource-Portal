// window.__APP_CONFIG__ is generated at container start from real runtime
// env vars (see docker/generate-runtime-config.sh), so it takes priority
// over the Vite build-time env vars, which may not be set correctly in
// every deployment pipeline.
const runtimeConfig =
  typeof window !== "undefined" ? window.__APP_CONFIG__ : undefined;

export const BASE_URL =
  runtimeConfig?.API_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000/api";

export const SERVER_ORIGIN =
  runtimeConfig?.API_ORIGIN ||
  import.meta.env.VITE_API_ORIGIN ||
  "http://127.0.0.1:8000";

function getCookie(name) {
  const cookies = document.cookie ? document.cookie.split("; ") : [];

  for (const cookie of cookies) {
    const [cookieName, ...parts] = cookie.split("=");

    if (cookieName === name) {
      return decodeURIComponent(parts.join("="));
    }
  }

  return null;
}

// DRF validation errors come back as { field_name: ["message", ...], ... }.
function formatFieldErrors(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return null;
  }

  const messages = Object.entries(body)
    .filter(([, value]) => Array.isArray(value) && value.length)
    .map(([field, value]) => `${field.replaceAll("_", " ")}: ${value[0]}`);

  return messages.length ? messages.join(" · ") : null;
}

export async function request(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  const csrfToken = getCookie("csrftoken");

  if (csrfToken && !["GET", "HEAD", "OPTIONS", "TRACE"].includes(method)) {
    headers["X-CSRFToken"] = csrfToken;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: "include",
    ...options,
    headers,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      body.detail ||
        body.message ||
        formatFieldErrors(body) ||
        `Request failed: ${res.status}`
    );
  }

  if (res.status === 204) {
    return null;
  }

  return res.json();
}
