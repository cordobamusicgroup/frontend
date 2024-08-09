import React from "react";
import { Drawer, Divider, List } from "@mui/material";
import { styled } from "@mui/material/styles";
import DrawerHeader from "../../atoms/header/DrawerHeader";
import PortalLogo from "../../atoms/logos/PortalLogo";
import DrawerList from "./VerticalDrawerList";
import { useAppSelector } from "@/lib/redux/hooks";
import { useSelector } from "react-redux";

interface DrawerProps {
  open: boolean;
}

const DrawerStyled = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open?: boolean }>(({ theme, open }) => ({
  width: open ? 240 : 60,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  "& .MuiDrawer-paper": {
    width: open ? 240 : 60,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
  },
}));

const VerticalDrawer: React.FC<DrawerProps> = ({ open }) => {
  return (
    <DrawerStyled variant="permanent" open={open}>
      <DrawerHeader>
        <PortalLogo small={!open} />
      </DrawerHeader>
      <Divider />
      <List>
        <DrawerList open={open} />
      </List>
    </DrawerStyled>
  );
};

export default VerticalDrawer;
