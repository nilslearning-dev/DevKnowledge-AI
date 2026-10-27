import {
  Avatar,
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";
import FolderIcon from "@mui/icons-material/Folder";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SettingsIcon from "@mui/icons-material/Settings";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { NavLink } from "react-router-dom";

const drawerWidth = 248;

const workspaceLinks = [
  { label: "Dashboard", path: "/", icon: DashboardIcon, end: true },
  { label: "Projects", path: "/projects", icon: FolderIcon },
  { label: "Documents", path: "/documents", icon: DescriptionIcon },
  { label: "AI Assistant", path: "/ai-assistant", icon: SmartToyIcon }
];

const settingsLink = { label: "Settings", path: "/settings", icon: SettingsIcon };

function DrawerContent({ onNavigate }) {
  const renderLink = ({ label, path, icon: Icon, end }) => (
    <ListItemButton
      key={path}
      component={NavLink}
      to={path}
      end={end}
      onClick={onNavigate}
      sx={{
        borderRadius: 1.5,
        mb: 0.5,
        py: 0.9,
        color: "#94A3B8",
        "&:hover": { bgcolor: "#1E293B", color: "#FFFFFF" },
        "&.active": {
          bgcolor: "#1E293B",
          color: "#FFFFFF",
          "& .MuiListItemIcon-root": { color: "#3B82F6" },
          "&:hover": { bgcolor: "#1E293B" }
        }
      }}
    >
      <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
        <Icon fontSize="small" />
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography fontSize={13} fontWeight={600}>
            {label}
          </Typography>
        }
      />
    </ListItemButton>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        px: 2,
        py: 3,
        bgcolor: "#0F172A",
        color: "#FFFFFF"
      }}
    >
      <Box sx={{ px: 1, mb: 4 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Avatar
            sx={{
              bgcolor: "#2563EB",
              width: 36,
              height: 36,
              borderRadius: 1.5
            }}
          >
            <SmartToyIcon fontSize="small" />
          </Avatar>
          <Box>
            <Typography
              fontWeight={700}
              fontSize={15}
              sx={{ lineHeight: 1.2 }}
            >
              DevKnowledge
            </Typography>
            <Typography fontSize={10} color="#94A3B8" letterSpacing={0.5}>
              AI PLATFORM
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Typography
        sx={{
          color: "#64748B",
          fontSize: 10.5,
          fontWeight: 700,
          px: 1.5,
          mb: 1,
          letterSpacing: 0.6
        }}
      >
        WORKSPACE
      </Typography>
      <List disablePadding>{workspaceLinks.map(renderLink)}</List>

      <Box sx={{ flexGrow: 1 }} />
      <Divider sx={{ borderColor: "#1E293B", mb: 2 }} />
      <List disablePadding>{renderLink(settingsLink)}</List>

      <Paper
        elevation={0}
        sx={{
          mt: 2,
          p: 1.75,
          bgcolor: "#1E293B",
          color: "white",
          borderRadius: 2,
          border: "1px solid #334155"
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <MenuBookIcon sx={{ color: "#3B82F6", fontSize: 17 }} />
          <Typography fontSize={12} fontWeight={600}>
            Knowledge Hub
          </Typography>
        </Stack>
        <Typography
          fontSize={11}
          color="#94A3B8"
          sx={{ mt: 0.75, lineHeight: 1.4 }}
        >
          Keep your team's technical knowledge organized and accessible.
        </Typography>
      </Paper>
    </Box>
  );
}

function SideMenu({ mobileOpen, onMobileClose }) {
  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "#0F172A",
            borderRight: "none"
          }
        }}
      >
        <DrawerContent />
      </Drawer>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "#0F172A",
            borderRight: "none"
          }
        }}
      >
        <DrawerContent onNavigate={onMobileClose} />
      </Drawer>
    </>
  );
}

export default SideMenu;
