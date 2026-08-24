const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

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

async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  const method = (options.method || "GET").toUpperCase();
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options.headers || {}),
  };
  const csrfToken = getCookie("csrftoken");

  if (
    csrfToken &&
    !["GET", "HEAD", "OPTIONS", "TRACE"].includes(method)
  ) {
    headers["X-CSRFToken"] = csrfToken;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: "include",
    ...options,
    headers,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || body.message || `Request failed: ${res.status}`);
  }

  if (res.status === 204) {
    return null;
  }

  return res.json();
}

export function fetchProjects() {
  return request("/projects/");
}

export function fetchProjectDetails(id) {
  return request(`/projects/${id}/`);
}

export function createProject(payload) {
  return request("/projects/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
