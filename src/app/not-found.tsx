"use client";

import Link from "next/link";
import { Box, Button, Container, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function NotFound() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          gap: 2,
        }}
      >

        <Typography variant="h1" component="h1" sx={{ fontSize: "5rem", fontWeight: "bold" }}>
          404
        </Typography>

        <Typography variant="h4" component="h2" gutterBottom>
          Page Not Found
        </Typography>

        <Typography variant="body1" color="text.secondary" paragraph>
          The page you are looking for doesn't exist or has been moved.
        </Typography>

        <Button variant="contained" color="primary" component={Link} href="/" size="large">
          Return to Home
        </Button>
      </Box>
    </Container>
  );
}
