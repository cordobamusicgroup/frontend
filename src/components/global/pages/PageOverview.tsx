"use client";
import React from "react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setPageTitle } from "@/lib/redux/slices/pageDataSlice";

const PageOverview: React.FC = () => {
  return <div>Welcome to Córdoba Music Group!</div>;
};

export default PageOverview;
