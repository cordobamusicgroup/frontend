import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import LoginLayout from "@/components/auth/login/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function SignIn() {
  return <LoginLayout />;
}
