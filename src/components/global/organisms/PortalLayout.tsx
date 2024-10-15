"use client";
import { ReactNode } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import VerticalMenu from "../../header/molecules/VerticalMenu";
import MainContent from "../molecules/MainContent";
import { useAppSelector } from "@/lib/redux/hooks";
import HeaderLayout from "@/components/header/HeaderLayout";

interface PortalLayoutProps {
  children: ReactNode;
}

const PortalLayout: React.FC<PortalLayoutProps> = ({ children }) => {
  const isOpen = useAppSelector((state) => state.pageData.openMenu);
  return (
    <div>
      <CssBaseline />
      <HeaderLayout />
      <VerticalMenu />
      <MainContent open={isOpen}>{children}</MainContent>
    </div>
  );
};

export default PortalLayout;
