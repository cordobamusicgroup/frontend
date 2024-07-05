import { Metadata } from "next";
import RootLayout from "../layout";

export const metadata: Metadata = {
  title: "Auth - Córdoba Music Group",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RootLayout>
      <html>
        <body>{children}</body>
      </html>
    </RootLayout>
  );
}
