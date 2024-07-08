import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import IconButton from "../../atoms/header/IconButton";

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

const AppBarComponent: React.FC<AppBarProps> = ({ open, handleDrawerOpen, pageTitle }) => (
  <AppBarStyled position="fixed" open={open}>
    <Toolbar>
      <IconButton open={open} onClick={handleDrawerOpen} />
      <Typography variant="h6" noWrap component="div">
        {pageTitle}
      </Typography>
    </Toolbar>
  </AppBarStyled>
);

export default AppBarComponent;
