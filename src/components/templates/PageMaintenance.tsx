"use client";
import React from "react";
import { Box, Typography, Container } from "@mui/material";
import ConstructionIcon from "@mui/icons-material/Construction";

const PageMaintenance: React.FC = () => {
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        minHeight: "50vh",
      }}
      component="main"
      maxWidth="xs"
    >
      <Box>
        <ConstructionIcon sx={{ fontSize: 100, color: "#09365F", mb: 1 }} />
        <Typography sx={{ fontSize: 30 }} gutterBottom>
          Page under maintenance
        </Typography>
        <Typography color="textSecondary" paragraph>
          We are currently performing maintenance on this page. Please check back later.
        </Typography>
      </Box>
    </Container>
  );
};

export default PageMaintenance;
