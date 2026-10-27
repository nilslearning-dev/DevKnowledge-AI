import { useEffect, useState } from "react";

import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  IconButton,
  Tooltip,
  Grid,
  Avatar,
  InputAdornment,
  Divider,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import FolderIcon from "@mui/icons-material/Folder";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import CloseIcon from "@mui/icons-material/Close";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject
} from "../services/projectService";

const initialForm = {
  name: "",
  description: "",
  technology: "",
  status: "Active",
  manager: ""
};

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialForm);

  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [searchText, setSearchText] = useState("");

  const fetchProjects = async () => {
    try {
      setError("");
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    getProjects()
      .then((data) => {
        if (active) setProjects(data);
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

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleAdd = () => {
    setEditId(null);
    setFormData(initialForm);
    setOpen(true);
  };

  const handleEdit = (project) => {
    setEditId(project._id);
    setFormData({
      name: project.name,
      description: project.description,
      technology: project.technology,
      status: project.status,
      manager: project.manager
    });
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError("");

      if (editId) {
        await updateProject(editId, formData);
      } else {
        await createProject(formData);
      }

      setOpen(false);
      setFormData(initialForm);
      setEditId(null);
      await fetchProjects();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirmed) return;

    try {
      setError("");
      await deleteProject(id);
      await fetchProjects();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const search = searchText.toLowerCase();
    return (
      project.name?.toLowerCase().includes(search) ||
      project.description?.toLowerCase().includes(search) ||
      project.technology?.toLowerCase().includes(search) ||
      project.manager?.toLowerCase().includes(search) ||
      project.status?.toLowerCase().includes(search)
    );
  });

  const activeProjects = projects.filter(
    (project) => project.status === "Active"
  ).length;

  const completedProjects = projects.filter(
    (project) => project.status === "Completed"
  ).length;

  const onHoldProjects = projects.filter(
    (project) => project.status === "On Hold"
  ).length;

  const getStatusColor = (status) => {
    if (status === "Active") return "success";
    if (status === "Completed") return "primary";
    return "warning";
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#F8FAFC"
        }}
      >
        <CircularProgress sx={{ color: "#2563EB" }} />
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          minWidth: 0,
          px: { xs: 2.5, md: 4 },
          py: 3.5
        }}
      >
        <Container maxWidth="xl" disableGutters>
          {/* HEADER - FIXED FLEX ALIGNMENT */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3
            }}
          >
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: "#0F172A",
                  fontSize: { xs: 22, md: 24 }
                }}
              >
                Projects
              </Typography>
              <Typography sx={{ color: "#64748B", mt: 0.25, fontSize: 13 }}>
                View and manage your registered projects.
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAdd}
              disableElevation
              sx={{
                bgcolor: "#2563EB",
                px: 2,
                py: 0.85,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                fontSize: 13,
                "&:hover": {
                  bgcolor: "#1D4ED8"
                }
              }}
            >
              Add Project
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* COMPACT FLAT STAT CARDS */}
          <Grid container spacing={2} mb={3}>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Paper sx={compactStatCardStyle}>
                <Box>
                  <Typography sx={statLabelStyle}>Total Projects</Typography>
                  <Typography sx={statValueStyle}>{projects.length}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: "#EFF6FF", color: "#2563EB", width: 34, height: 34 }}>
                  <FolderIcon sx={{ fontSize: 18 }} />
                </Avatar>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Paper sx={compactStatCardStyle}>
                <Box>
                  <Typography sx={statLabelStyle}>Active Projects</Typography>
                  <Typography sx={statValueStyle}>{activeProjects}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: "#ECFDF5", color: "#10B981", width: 34, height: 34 }}>
                  <CheckCircleIcon sx={{ fontSize: 18 }} />
                </Avatar>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Paper sx={compactStatCardStyle}>
                <Box>
                  <Typography sx={statLabelStyle}>Completed</Typography>
                  <Typography sx={statValueStyle}>{completedProjects}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: "#F5F3FF", color: "#8B5CF6", width: 34, height: 34 }}>
                  <CheckCircleIcon sx={{ fontSize: 18 }} />
                </Avatar>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Paper sx={compactStatCardStyle}>
                <Box>
                  <Typography sx={statLabelStyle}>On Hold</Typography>
                  <Typography sx={statValueStyle}>{onHoldProjects}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: "#FFFBEB", color: "#F59E0B", width: 34, height: 34 }}>
                  <PauseCircleIcon sx={{ fontSize: 18 }} />
                </Avatar>
              </Paper>
            </Grid>
          </Grid>

          {/* PROJECT TABLE */}
          <Paper
            elevation={0}
            sx={{
              border: "1px solid #E2E8F0",
              borderRadius: 2.5,
              overflow: "hidden",
              bgcolor: "#FFFFFF"
            }}
          >
            <Box
              sx={{
                px: 2.5,
                py: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2
              }}
            >
              <Box>
                <Typography fontWeight={700} fontSize={15} color="#0F172A">
                  All Projects
                </Typography>
                <Typography color="#64748B" fontSize={12} mt={0.25}>
                  View and manage your registered projects
                </Typography>
              </Box>

              <TextField
                size="small"
                placeholder="Search projects..."
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                sx={{
                  width: { xs: "100%", sm: 240 },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: "#F8FAFC",
                    fontSize: 12.5,
                    "& fieldset": { borderColor: "#E2E8F0" }
                  }
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "#94A3B8", fontSize: 17 }} />
                      </InputAdornment>
                    )
                  }
                }}
              />
            </Box>

            <Divider sx={{ borderColor: "#F1F5F9" }} />

            <TableContainer sx={{ overflowX: "auto" }}>
              <Table sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#F8FAFC" }}>
                    {[
                      "PROJECT",
                      "DESCRIPTION",
                      "TECHNOLOGY",
                      "MANAGER",
                      "STATUS",
                      "ACTIONS"
                    ].map((heading) => (
                      <TableCell
                        key={heading}
                        sx={{
                          color: "#64748B",
                          fontSize: 10.5,
                          fontWeight: 700,
                          letterSpacing: 0.5,
                          py: 1.5
                        }}
                      >
                        {heading}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredProjects.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                        <FolderIcon sx={{ color: "#CBD5E1", fontSize: 32 }} />
                        <Typography color="#64748B" mt={1} fontSize={13}>
                          No projects found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProjects.map((project) => (
                      <TableRow
                        key={project._id}
                        hover
                        sx={{
                          "&:hover": { bgcolor: "#F8FAFC" },
                          "& td": { borderColor: "#F1F5F9", py: 1.5 }
                        }}
                      >
                        <TableCell>
                          <Typography fontWeight={600} fontSize={13} color="#1E293B">
                            {project.name}
                          </Typography>
                        </TableCell>

                        <TableCell sx={{ maxWidth: 220 }}>
                          <Typography fontSize={12} color="#64748B" noWrap title={project.description}>
                            {project.description}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={project.technology}
                            size="small"
                            sx={{
                              bgcolor: "#F1F5F9",
                              color: "#334155",
                              fontSize: 11,
                              fontWeight: 500,
                              borderRadius: 1.2
                            }}
                          />
                        </TableCell>

                        <TableCell>
                          <Stack
                            direction="row"
                            spacing={1}
                            sx={{ alignItems: "center" }}
                          >
                            <Avatar
                              sx={{
                                width: 24,
                                height: 24,
                                bgcolor: "#EFF6FF",
                                color: "#2563EB",
                                fontSize: 10.5,
                                fontWeight: 700
                              }}
                            >
                              {project.manager?.charAt(0)?.toUpperCase()}
                            </Avatar>
                            <Typography fontSize={12} color="#334155">
                              {project.manager}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={project.status}
                            color={getStatusColor(project.status)}
                            size="small"
                            sx={{
                              fontSize: 10.5,
                              fontWeight: 600,
                              borderRadius: 1.2,
                              minWidth: 72,
                              height: 22
                            }}
                          />
                        </TableCell>

                        <TableCell>
                          <Stack direction="row" spacing={0.5}>
                            <Tooltip title="Edit Project">
                              <IconButton
                                size="small"
                                onClick={() => handleEdit(project)}
                                sx={{
                                  color: "#2563EB",
                                  bgcolor: "#EFF6FF",
                                  borderRadius: 1.2,
                                  p: 0.6,
                                  "&:hover": { bgcolor: "#DBEAFE" }
                                }}
                              >
                                <EditIcon sx={{ fontSize: 14 }} />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Delete Project">
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(project._id)}
                                sx={{
                                  color: "#EF4444",
                                  bgcolor: "#FEF2F2",
                                  borderRadius: 1.2,
                                  p: 0.6,
                                  "&:hover": { bgcolor: "#FEE2E2" }
                                }}
                              >
                                <DeleteIcon sx={{ fontSize: 14 }} />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Divider sx={{ borderColor: "#F1F5F9" }} />

            <Box sx={{ px: 2.5, py: 1.5 }}>
              <Typography color="#64748B" fontSize={11.5}>
                Showing {filteredProjects.length} of {projects.length} projects
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* ADD / EDIT DIALOG */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { borderRadius: 2.5, p: 0.5 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <Box>
              <Typography fontWeight={700} fontSize={17} color="#0F172A">
                {editId ? "Edit Project" : "Create New Project"}
              </Typography>
              <Typography fontSize={12} color="#64748B" mt={0.25}>
                Enter your project information below.
              </Typography>
            </Box>
            <IconButton onClick={() => setOpen(false)} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Project Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              size="small"
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              required
              size="small"
            />
            <TextField
              label="Technology"
              name="technology"
              value={formData.technology}
              onChange={handleChange}
              fullWidth
              size="small"
            />
            <TextField
              select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              fullWidth
              size="small"
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="On Hold">On Hold</MenuItem>
            </TextField>
            <TextField
              label="Manager"
              name="manager"
              value={formData.manager}
              onChange={handleChange}
              fullWidth
              required
              size="small"
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
          <Button
            onClick={() => setOpen(false)}
            sx={{ color: "#64748B", textTransform: "none", fontWeight: 600, fontSize: 13 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={
              saving ||
              !formData.name.trim() ||
              !formData.description.trim() ||
              !formData.manager.trim()
            }
            disableElevation
            sx={{
              bgcolor: "#2563EB",
              px: 2.5,
              py: 0.8,
              borderRadius: 1.75,
              textTransform: "none",
              fontWeight: 600,
              fontSize: 13,
              "&:hover": { bgcolor: "#1D4ED8" }
            }}
          >
            {saving ? "Saving..." : editId ? "Update Project" : "Save Project"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// COMPACT FLAT STAT CARD STYLES
const compactStatCardStyle = {
  py: 1.5,
  px: 2,
  borderRadius: 2.5,
  border: "1px solid #E2E8F0",
  boxShadow: "none",
  bgcolor: "#FFFFFF",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  transition: "0.2s ease-in-out",
  "&:hover": {
    borderColor: "#CBD5E1"
  }
};

const statLabelStyle = {
  color: "#64748B",
  fontSize: 12,
  fontWeight: 600
};

const statValueStyle = {
  color: "#0F172A",
  fontSize: 22,
  fontWeight: 700,
  lineHeight: 1.2,
  mt: 0.25
};

export default Projects;