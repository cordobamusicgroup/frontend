import React from "react";
import { IconButton as MUIIconButton } from "@mui/material";
import { Menu as MenuIcon, MenuOpen } from "@mui/icons-material";

interface IconButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({ isOpen, onClick }) => (
  <MUIIconButton color="inherit" aria-label="toggle menu" onClick={onClick} edge="start">
    {isOpen ? <MenuOpen /> : <MenuIcon />}
  </MUIIconButton>
);

export default IconButton;