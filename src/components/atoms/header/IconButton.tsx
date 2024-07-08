import React from "react";
import { IconButton as MUIIconButton } from "@mui/material";
import { Menu as MenuIcon, MenuOpen } from "@mui/icons-material";

interface IconButtonProps {
  open: boolean;
  onClick: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({ open, onClick }) => (
  <MUIIconButton color="inherit" aria-label="open drawer" onClick={onClick} edge="start" sx={{ marginRight: 5 }}>
    {open ? <MenuOpen /> : <MenuIcon />}
  </MUIIconButton>
);

export default IconButton;
