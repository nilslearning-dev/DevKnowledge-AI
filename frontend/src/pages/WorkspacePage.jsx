import { Box, Button, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";

function WorkspacePage({ title, description, children }) {
  return (
    <Box sx={{ px: { xs: 2.5, md: 4 }, py: 3.5 }}>
      <Typography variant="h5" fontWeight={700} color="#0F172A" sx={{ mb: 0.5 }}>
        {title}
      </Typography>
      <Typography color="#64748B" fontSize={13} sx={{ mb: 3 }}>
        {description}
      </Typography>
      {children ?? (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            border: "1px solid #E2E8F0",
            borderRadius: 2.5,
            textAlign: "center"
          }}
        >
          <Typography fontWeight={700} color="#0F172A" sx={{ mb: 1 }}>
            This workspace is ready for your content
          </Typography>
          <Typography color="#64748B" fontSize={13} sx={{ mb: 2.5 }}>
            This section does not have backend functionality connected yet.
          </Typography>
          <Button
            component={Link}
            to="/"
            variant="outlined"
            sx={{ textTransform: "none" }}
          >
            Back to dashboard
          </Button>
        </Paper>
      )}
    </Box>
  );
}

export default WorkspacePage;
