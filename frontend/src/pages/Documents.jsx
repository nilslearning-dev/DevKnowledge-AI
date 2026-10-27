import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Stack,
  CircularProgress,
  Alert
} from "@mui/material";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";

import { getProjects } from "../services/projectService";
import {
  uploadDocument,
  getDocumentsByProject
} from "../services/documentService";

const Documents = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [tags, setTags] = useState("API, Payment");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Load projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(Array.isArray(data) ? data : data.projects || []);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProjects();
  }, []);

  // Load documents when project changes
  useEffect(() => {
    if (!selectedProject) {
      setDocuments([]);
      return;
    }

    const fetchDocuments = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getDocumentsByProject(selectedProject);
        setDocuments(data.documents || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [selectedProject]);

  // Upload document
  const handleUpload = async () => {
    if (!selectedProject) {
      setError("Please select a project");
      return;
    }

    if (!selectedFile) {
      setError("Please select a document");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const formData = new FormData();

      formData.append("document", selectedFile);
      formData.append("projectId", selectedProject);

      const tagArray = tags
        .split(",")
        .map(tag => tag.trim())
        .filter(Boolean);

      formData.append("tags", JSON.stringify(tagArray));

      await uploadDocument(formData);

      setMessage("Document uploaded successfully!");
      setSelectedFile(null);

      const input = document.getElementById("document-input");
      if (input) input.value = "";

      const data = await getDocumentsByProject(selectedProject);
      setDocuments(data.documents || []);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" mb={1}>
        Documents & Knowledge Hub
      </Typography>

      <Typography color="text.secondary" mb={3}>
        Upload and manage your project documentation.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Upload Document
          </Typography>

          <Stack spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Select Project</InputLabel>

              <Select
                value={selectedProject}
                label="Select Project"
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                {projects.map((project) => (
                  <MenuItem key={project._id} value={project._id}>
                    {project.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
            >
              Choose PDF / TXT / MD

              <input
                id="document-input"
                hidden
                type="file"
                accept=".pdf,.txt,.md"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </Button>

            {selectedFile && (
              <Typography variant="body2">
                Selected: {selectedFile.name}
              </Typography>
            )}

            <TextField
              label="Tags (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              fullWidth
            />

            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={loading}
              startIcon={<CloudUploadIcon />}
            >
              {loading ? "Uploading..." : "Upload Document"}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Uploaded Documents
          </Typography>

          {!selectedProject && (
            <Typography color="text.secondary">
              Select a project to view its documents.
            </Typography>
          )}

          {loading && <CircularProgress size={28} />}

          {!loading && selectedProject && documents.length === 0 && (
            <Typography color="text.secondary">
              No documents found for this project.
            </Typography>
          )}

          <Stack spacing={2}>
            {documents.map((document) => (
              <Box
                key={document._id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  border: "1px solid #ddd",
                  borderRadius: 2
                }}
              >
                <DescriptionIcon color="primary" />

                <Box sx={{ flexGrow: 1 }}>
                  <Typography fontWeight="bold">
                    {document.name}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    {document.fileType} · {(document.fileSize / 1024).toFixed(1)} KB
                  </Typography>

                  <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                    {document.tags?.map((tag) => (
                      <Chip key={tag} label={tag} size="small" />
                    ))}
                  </Stack>
                </Box>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Documents;