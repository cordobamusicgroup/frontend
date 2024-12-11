import React from "react";
import { Box } from "@mui/material";

interface BoxButtonsHeaderProps {
  children: React.ReactNode;
}

const BoxButtonsHeader: React.FC<BoxButtonsHeaderProps> = ({ children }) => {
  return <Box sx={{ display: "flex", gap: 2 }}>{children}</Box>;
};

export default BoxButtonsHeader;
