import { useEffect, useState } from "react";
import {
  Alert,
  CircularProgress,
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Stack
} from "@mui/material";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";

import WorkspacePage from "./WorkspacePage";
import AIChat from "../components/AIChat";
import { getProjects } from "../services/projectService";

function Assistant() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getProjects()
      .then((projectList) => {
        if (!active) return;
        setProjects(projectList);
        if (projectList.length > 0) {
          setSelectedProject(projectList[0]._id);
        }
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <WorkspacePage
      title="AI Assistant"
      description="Get help finding and understanding your team's technical knowledge."
    >
      <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Project Selection Card */}
        <Card variant="outlined" sx={{ borderRadius: 2, borderColor: "divider" }}>
          <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
            <Stack spacing={2}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FolderOpenOutlinedIcon color="action" fontSize="small" />
                <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                  Active Project Scope
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ borderRadius: 1.5 }}>
                  {error}
                </Alert>
              )}

              {loading && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1 }}>
                  <CircularProgress size={18} thickness={4} />
                  <Typography variant="body2" color="text.secondary">
                    Loading your projects...
                  </Typography>
                </Box>
              )}

              {!loading && projects.length > 0 && (
                <FormControl fullWidth size="small" sx={{ maxWidth: 420 }}>
                  <InputLabel id="project-select-label">Select Project</InputLabel>
                  <Select
                    labelId="project-select-label"
                    value={selectedProject}
                    label="Select Project"
                    onChange={(e) => setSelectedProject(e.target.value)}
                    disabled={loading || projects.length === 0}
                    sx={{ borderRadius: 1.5 }}
                  >
                    {projects.map((project) => (
                      <MenuItem key={project._id} value={project._id}>
                        {project.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {!loading && projects.length === 0 && (
                <Typography variant="body2" color={error ? "text.secondary" : "error"}>
                  {error ? "The project list could not be loaded." : "No projects found. Please create a project first to use the AI assistant."}
                </Typography>
              )}
            </Stack>
          </CardContent>
        </Card>

        {/* AI Chat Workspace Container */}
        {selectedProject && !loading && (
          <Box>
            <AIChat projectId={selectedProject} />
          </Box>
        )}
      </Box>
    </WorkspacePage>
  );
}

export default Assistant;