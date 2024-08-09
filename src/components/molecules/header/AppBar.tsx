import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Menu, MenuItem, IconButton as MuiIconButton, Icon } from "@mui/material";
import { styled } from "@mui/material/styles";
import { AccountCircle } from "@mui/icons-material";
import IconButton from "../../atoms/header/IconButton";
import UserMenu from "./UserMenu";

interface AppBarProps {
  open: boolean;
  handleDrawerOpen: () => void;
  pageTitle: string;
}

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open?: boolean }>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - 240px)`,
    marginLeft: `240px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  ...(!open && {
    width: `calc(100% - 60px)`,
    marginLeft: `60px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  }),
}));

const ToolbarContent = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  alignItems: "center",
});

const AppBarComponent: React.FC<AppBarProps> = ({ open, handleDrawerOpen, pageTitle }) => {
  return (
    <AppBarStyled position="fixed" open={open}>
      <Toolbar>
        <ToolbarContent>
          <div style={{ display: "flex", alignItems: "center" }}>
            <IconButton open={open} onClick={handleDrawerOpen} />
            <Typography variant="h6" noWrap component="div">
              {pageTitle}
            </Typography>
          </div>
          <div>
            <UserMenu />
          </div>
        </ToolbarContent>
      </Toolbar>
    </AppBarStyled>
  );
};

export default AppBarComponent;
