"use client";
import React, { useState, ReactNode, Suspense } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import AppBarComponent from "../molecules/header/AppBar";
import DrawerComponent from "../molecules/header/Drawer";
import MainContent from "./MainContent";

interface PortalLayoutProps {
  children: ReactNode;
  pageTitle: any;
}

const PortalLayout: React.FC<PortalLayoutProps> = ({ children, pageTitle }) => {
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  return (
    <div>
      <CssBaseline />
      <AppBarComponent open={open} handleDrawerOpen={handleDrawerOpen} pageTitle={pageTitle} />
      <DrawerComponent open={open} />
      <MainContent open={open}>{children}</MainContent>
    </div>
  );
};

export default PortalLayout;
