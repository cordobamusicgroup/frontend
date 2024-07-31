import "./globals.css";
import { Metadata } from "next";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import StyleProviders from "@/context/StyleContext";
import React from "react";
import ReduxProvider from "@/context/ReduxContext";
import TanstackQueryProvider from "@/context/TanstackContext";

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
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <ReduxProvider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <StyleProviders>
          <html>
            <body>
              <TanstackQueryProvider>{children}</TanstackQueryProvider>
            </body>
          </html>
        </StyleProviders>
      </NextIntlClientProvider>
    </ReduxProvider>
  );
}
