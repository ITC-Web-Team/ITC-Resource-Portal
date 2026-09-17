import { request } from "./apiClient";

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
