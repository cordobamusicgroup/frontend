"use client";
import React from "react";
import { Container, Typography, Box } from "@mui/material";

const PageOverview: React.FC = () => {
  return (
    <Container>
      <Box my={4}>
        <Typography variant="h1" component="h1" gutterBottom>
          Welcome to Córdoba Music Group!
        </Typography>
        <Typography variant="body1" paragraph>
          Córdoba Music Group is your go-to platform for all things music. We are a music distributor and this is our new platform currently under continuous development. Explore our vast collection of music, stay updated with the latest trends, and connect with other music enthusiasts.
        </Typography>
        <Typography variant="body2" color="textSecondary">
          For feedback, please email us at feedback@cordobamusicgroup.co.uk
        </Typography>
      </Box>
    </Container>
  );
};

export default PageOverview;
