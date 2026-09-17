import { request } from "./apiClient";

export function fetchRequests({ status = "pending", search = "" } = {}) {
  const params = new URLSearchParams({ status, search });
  return request(`/requests?${params.toString()}`);
  // [{ id, user, project, status, date }, ...]
}

export function fetchRequestDetails(id) {
  return request(`/requests/${id}`);
}

export function approveRequest(id) {
  return request(`/requests/${id}/approve`, { method: "PATCH" });
}

export function rejectRequest(id) {
  return request(`/requests/${id}/reject`, { method: "PATCH" });
}
