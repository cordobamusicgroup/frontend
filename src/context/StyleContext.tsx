"use client";

import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "@/theme";

interface ProviersProps {
  readonly children: React.ReactNode;
}
export default function StyleProviders({ children }: ProviersProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
