import { Metadata } from "next";
import RootLayout from "../layout";
import { CssBaseline } from "@mui/material";

export const metadata: Metadata = {
  title: {
    default: "Auth",
    template: "%s - Córdoba Music Group",
  },
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RootLayout>
      <CssBaseline />
      {children}
    </RootLayout>
  );
}
