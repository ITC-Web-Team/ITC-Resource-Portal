import { request } from "./apiClient";

export function fetchProfile() {
  return request("/profile/me/");
}

export function fetchMentor() {
  return request("/profile/mentor/");
}

export function fetchMyProjects() {
  return request("/profile/projects/");
}
