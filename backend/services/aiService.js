const API_URL = "http://localhost:5000/api/ai";

export const askAI = async (question, projectId) => {
  const response = await fetch(`${API_URL}/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      question,
      projectId
    })
  });

  if (!response.ok) {
    throw new Error("Failed to get AI response");
  }

  return response.json();
};