import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import LoginLayout from "@/components/organisms/signin/LoginLayout";

export default function SignIn() {
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <LoginLayout />
    </Container>
  );
}
