import "./globals.css";
import { Metadata } from "next";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import StyleProviders from "@/context/StyleContext";
import React from "react";
import ReduxProvider from "@/context/ReduxContext";
import { AuthProvider } from "@/context/AuthContext";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

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
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <ReduxProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <AuthProvider>
              <StyleProviders>{children}</StyleProviders>
            </AuthProvider>
          </NextIntlClientProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
