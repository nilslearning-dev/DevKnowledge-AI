import { apiRequest } from "./apiClient";

export const askAI = async (question, projectId) => {
  return apiRequest("/ai/ask", {
    method: "POST",
    body: JSON.stringify({
      question,
      projectId
    })
  });
};