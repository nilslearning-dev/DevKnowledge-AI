import { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FolderIcon from "@mui/icons-material/Folder";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import { Link } from "react-router-dom";
import { getProjects } from "../services/projectService";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const activeProjects = projects.filter(
    (project) => project.status === "Active"
  ).length;
  const completedProjects = projects.filter(
    (project) => project.status === "Completed"
  ).length;
  const onHoldProjects = projects.filter(
    (project) => project.status === "On Hold"
  ).length;

  const stats = [
    { label: "Total Projects", value: projects.length, icon: FolderIcon, color: "#2563EB", bg: "#EFF6FF" },
    { label: "Active Projects", value: activeProjects, icon: CheckCircleIcon, color: "#10B981", bg: "#ECFDF5" },
    { label: "Completed", value: completedProjects, icon: CheckCircleIcon, color: "#8B5CF6", bg: "#F5F3FF" },
    { label: "On Hold", value: onHoldProjects, icon: PauseCircleIcon, color: "#F59E0B", bg: "#FFFBEB" }
  ];

  return (
    <Box sx={{ px: { xs: 2.5, md: 4 }, py: 3.5 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 3
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700} color="#0F172A">
            Dashboard
          </Typography>
          <Typography sx={{ color: "#64748B", mt: 0.25, fontSize: 13 }}>
            Welcome back! Here's your project overview.
          </Typography>
        </Box>
        <Button
          component={Link}
          to="/projects"
          variant="contained"
          disableElevation
          sx={{
            bgcolor: "#2563EB",
            px: 2,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600
          }}
        >
          View projects
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ minHeight: "40vh", display: "grid", placeItems: "center" }}>
          <CircularProgress sx={{ color: "#2563EB" }} />
        </Box>
      ) : (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {stats.map(({ label, value, icon: Icon, color, bg }) => (
              <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={label}>
                <Paper
                  elevation={0}
                  sx={{
                    py: 1.75,
                    px: 2,
                    borderRadius: 2.5,
                    border: "1px solid #E2E8F0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <Box>
                    <Typography sx={{ color: "#64748B", fontSize: 12, fontWeight: 600 }}>
                      {label}
                    </Typography>
                    <Typography sx={{ color: "#0F172A", fontSize: 22, fontWeight: 700 }}>
                      {value}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: bg, color, width: 36, height: 36 }}>
                    <Icon sx={{ fontSize: 19 }} />
                  </Avatar>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 2.5 },
              border: "1px solid #E2E8F0",
              borderRadius: 2.5
            }}
          >
            <Stack
              direction="row"
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1.5
              }}
            >
              <Box>
                <Typography fontWeight={700} color="#0F172A">
                  Recent projects
                </Typography>
                <Typography color="#64748B" fontSize={12}>
                  Your latest project updates
                </Typography>
              </Box>
              <Button
                component={Link}
                to="/projects"
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                All projects
              </Button>
            </Stack>
            {projects.length === 0 ? (
              <Typography color="#64748B" fontSize={13} sx={{ py: 2 }}>
                No projects yet. Open Projects to create your first project.
              </Typography>
            ) : (
              projects.slice(-5).reverse().map((project) => (
                <Box
                  key={project._id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                    py: 1.5,
                    borderTop: "1px solid #F1F5F9"
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography fontWeight={600} fontSize={13} noWrap>
                      {project.name}
                    </Typography>
                    <Typography color="#64748B" fontSize={12} noWrap>
                      {project.technology || project.description}
                    </Typography>
                  </Box>
                  <Typography color="#64748B" fontSize={12} sx={{ flexShrink: 0 }}>
                    {project.status}
                  </Typography>
                </Box>
              ))
            )}
          </Paper>
        </>
      )}
    </Box>
  );
}

export default Dashboard;
