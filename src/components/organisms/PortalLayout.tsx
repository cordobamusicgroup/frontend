"use client";
import React, { useState, ReactNode, useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import VerticalMenu from "../molecules/header/VerticalMenu";
import MainContent from "../molecules/MainContent";
import Header from "./header/HeaderApp";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setPageTitle } from "@/lib/redux/slices/pageDataSlice";

interface PortalLayoutProps {
  children: ReactNode;
}

const PortalLayout: React.FC<PortalLayoutProps> = ({ children }) => {
  const isOpen = useAppSelector((state) => state.pageData.openMenu);
  const dispatch = useAppDispatch();

  return (
    <div>
      <CssBaseline />
      <Header />
      <VerticalMenu />
      <MainContent open={isOpen}>{children}</MainContent>
    </div>
  );
};

export default PortalLayout;
