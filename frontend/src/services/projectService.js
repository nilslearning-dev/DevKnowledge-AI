import { apiRequest } from "./apiClient";

export const getProjects = async () => {
  const result = await apiRequest("/projects");
  if (!Array.isArray(result?.data)) {
    throw new Error("The projects API returned an invalid response");
  }

  return result.data;
};

export const createProject = async (projectData) => {
  const result = await apiRequest("/projects", {
    method: "POST",
    body: JSON.stringify(projectData)
  });

  return result.data;
};

export const updateProject = async (id, projectData) => {
  const result = await apiRequest(`/projects/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(projectData)
  });

  return result.data;
};

export const deleteProject = async (id) => {
  return apiRequest(`/projects/${encodeURIComponent(id)}`, {
    method: "DELETE"
  });
};
