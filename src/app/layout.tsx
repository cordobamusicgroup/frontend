import "./globals.css";
import { Metadata } from "next";
import StyleProviders from "@/context/StyleContext";
import React from "react";
import ReduxProvider from "@/context/ReduxContext";
import { AuthProvider } from "@/context/AuthContext";
import { themeAlpine, themeBalham, themeQuartz } from "@ag-grid-community/theming";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { FormProvider, useForm } from "react-hook-form";

export const metadata: Metadata = {
  title: {
    default: "Córdoba Music Group",
    template: "%s - Córdoba Music Group",
  },
};

interface RootLayoutProps {
  readonly children: React.ReactNode;
}
export const runtime = "edge";
export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html>
      <body>
        <ReduxProvider>
          <AuthProvider>
            <StyleProviders>{children}</StyleProviders>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
