"use client";
import { ReactNode } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import useMediaQuery from "@mui/material/useMediaQuery";
import VerticalMenu from "../../header/molecules/VerticalMenu";
import MainContent from "../molecules/MainContent";
import HeaderLayout from "@/components/header/HeaderLayout";
import { useAppStore } from "@/lib/zustand/zustandStore";

interface PortalLayoutProps {
  children: ReactNode;
}

const PortalLayout: React.FC<PortalLayoutProps> = ({ children }) => {
  const isOpen = useAppStore.pageData((state) => state.openMenu);

  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down("sm"));

  return (
    <div>
      <CssBaseline />
      <HeaderLayout />
      {!isMobile && <VerticalMenu />}
      {isMobile && isOpen && <VerticalMenu />}
      <MainContent open={isOpen} isMobile={isMobile}>
        {children}
      </MainContent>
    </div>
  );
};

export default PortalLayout;
