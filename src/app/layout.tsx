import "./globals.css";
import theme from "@/theme";
import { AuthProvider } from "@/context/AuthContext";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Partner Portal',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}
