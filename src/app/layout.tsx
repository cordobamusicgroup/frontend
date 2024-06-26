"use client";

import "./globals.css";
import theme from "@/theme";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (user === null && pathname !== "/auth") {
      router.push("/auth");
    } else {
    }
  }, [user, router, pathname]);

  return <>{children}</>;
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AuthGuard>
          <html lang="en">
            <body>{children}</body>
          </html>
        </AuthGuard>
      </AuthProvider>
    </ThemeProvider>
  );
}
