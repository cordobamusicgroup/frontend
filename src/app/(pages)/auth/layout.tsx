import { Metadata } from "next";
import RootLayout from "../../layout";

export const metadata: Metadata = {
  title: "Auth",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootLayout>{children}</RootLayout>;
}
