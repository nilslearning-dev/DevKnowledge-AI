import { lazy, Suspense, useState } from "react";
import {
  AppBar,
  Box,
  CircularProgress,
  IconButton,
  Toolbar,
  Typography
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import SideMenu from "./components/SideMenu";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Projects = lazy(() => import("./pages/Projects"));
const Documents = lazy(() => import("./pages/Documents"));
const Assistant = lazy(() => import("./pages/Assistant"));
const Settings = lazy(() => import("./pages/Settings"));

const pageTitles = {
  "/": "Dashboard",
  "/projects": "Projects",
  "/documents": "Documents",
  "/ai-assistant": "AI Assistant",
  "/settings": "Settings"
};

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || "Dashboard";

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F8FAFC" }}>
      <SideMenu
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            display: { xs: "block", md: "none" },
            bgcolor: "#FFFFFF",
            color: "#0F172A",
            borderBottom: "1px solid #E2E8F0"
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              aria-label="Open navigation menu"
              onClick={() => setMobileMenuOpen(true)}
              sx={{ mr: 1.5 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography fontWeight={700}>{pageTitle}</Typography>
          </Toolbar>
        </AppBar>

        <Suspense
          fallback={
            <Box
              role="status"
              aria-label="Loading page"
              sx={{
                minHeight: "60vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <CircularProgress sx={{ color: "#2563EB" }} />
            </Box>
          }
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/ai-assistant" element={<Assistant />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Box>
    </Box>
  );
}

export default App;
