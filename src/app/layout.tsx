import { Metadata } from "next";
import StyleProviders from "@/context/StyleContext";
import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import "@fontsource/roboto";

export const metadata: Metadata = {
  title: {
    default: "Córdoba Music Group",
    template: "%s - Córdoba Music Group",
  },
};

interface RootLayoutProps {
  readonly children: React.ReactNode;
}
export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html>
      <body>
        <AuthProvider>
          <StyleProviders>{children}</StyleProviders>
        </AuthProvider>
      </body>
    </html>
  );
}
