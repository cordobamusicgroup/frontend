import React from "react";
import { Box } from "@mui/material";

interface CustomPageHeaderProps {
  background: string;
  color: string;
  children: React.ReactNode;
}

const CustomPageHeader: React.FC<CustomPageHeaderProps> = ({ background, color, children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
        gap: 2,
        background,
        color,
        boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
        padding: "13px",
        borderRadius: "5px",
        position: "sticky",
        top: "80px",
        zIndex: "50",
      }}
    >
      {children}
    </Box>
  );
};

export default CustomPageHeader;
