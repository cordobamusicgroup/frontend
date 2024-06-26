// src/app/login/page.tsx
"use client";

import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import SignInBox from "@/components/organisms/auth/SignInBox";


export default function SignIn() {
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <SignInBox />
    </Container>
  );
}
