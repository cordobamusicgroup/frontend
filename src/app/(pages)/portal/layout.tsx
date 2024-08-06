import { Metadata } from "next";
import PortalLayout from "@/components/organisms/PortalLayout";
import RootLayout from "@/app/layout";
import { Suspense } from "react";

interface PortalProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Portal",
};

export default function PortalPageLayout({ children }: PortalProps) {
  return (
    <RootLayout>
      <PortalLayout pageTitle={metadata.title as string}>{children}</PortalLayout>
    </RootLayout>
  );
}
