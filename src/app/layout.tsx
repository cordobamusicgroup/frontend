import "./globals.css";
import theme from "@/theme";
import { AuthProvider } from "@/context/AuthContext";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Metadata } from "next";
import { GlobalProvider } from "@/context/GlobalContext";

export const metadata: Metadata = {
  title: "Córdoba Music Group",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalProvider>
        <AuthProvider>
          <html>
            <body>{children}</body>
          </html>
        </AuthProvider>
      </GlobalProvider>
    </ThemeProvider>
  );
}
