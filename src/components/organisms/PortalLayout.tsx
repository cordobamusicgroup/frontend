"use client";
import React, { useState, ReactNode } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import VerticalMenu from "../molecules/header/VerticalMenu";
import MainContent from "../molecules/MainContent";
import Header from "./header/HeaderApp";
import { useAppSelector } from "@/lib/redux/hooks";

interface PortalLayoutProps {
  children: ReactNode;
}

const PortalLayout: React.FC<PortalLayoutProps> = ({ children }) => {
  const isOpen = useAppSelector((state) => state.menu.isOpen);

  return (
    <div>
      <CssBaseline />
      <Header title="test" />
      <VerticalMenu />
      <MainContent open={isOpen}>{children}</MainContent>
    </div>
  );
};

export default PortalLayout;
