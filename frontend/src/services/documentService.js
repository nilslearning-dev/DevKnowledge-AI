const API_URL = "http://localhost:5000/api/documents";

// Upload document
export const uploadDocument = async (formData) => {
  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Document upload failed");
  }

  return response.json();
};

// Get documents by project ID
export const getDocumentsByProject = async (projectId) => {
  const response = await fetch(`${API_URL}/project/${projectId}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch documents");
  }

  return response.json();
};