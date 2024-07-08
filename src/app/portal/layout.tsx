import { Metadata } from "next";
import RootLayout from "../layout";
import PortalLayout from "@/components/organisms/PortalLayout";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RootLayout>
      <PortalLayout pageTitle="Overview">{children}</PortalLayout>
    </RootLayout>
  );
}
