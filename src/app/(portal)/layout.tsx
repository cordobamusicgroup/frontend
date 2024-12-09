import { Metadata } from "next";
import PortalLayout from "@/components/global/organisms/PortalLayout";
import RootLayout from "@/app/layout";
import { Suspense } from "react";

interface PortalProps {
  children: React.ReactNode;
}

export default function PortalPageLayout({ children }: PortalProps) {
  return (
    <RootLayout>
      <PortalLayout>{children}</PortalLayout>
    </RootLayout>
  );
}
