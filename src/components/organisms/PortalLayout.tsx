"use client";
import React, { useState, ReactNode, Suspense } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import AppBarComponent from "../molecules/header/AppBar";
import VerticalDrawer from "../molecules/header/VerticalDrawer";
import MainContent from "./MainContent";
import { metadata } from "@/app/layout";

interface PortalLayoutProps {
  children: ReactNode;
}

const PortalLayout: React.FC<PortalLayoutProps> = ({ children }) => {
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  return (
    <div>
      <CssBaseline />
      <AppBarComponent open={open} handleDrawerOpen={handleDrawerOpen} pageTitle="" />
      <VerticalDrawer open={open} />
      <MainContent open={open}>{children}</MainContent>
    </div>
  );
};

export default PortalLayout;
