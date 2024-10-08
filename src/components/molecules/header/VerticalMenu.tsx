import React from "react";
import { Drawer, Divider, List } from "@mui/material";
import { styled } from "@mui/material/styles";
import VerticalMenuHeader from "./VerticalMenuHeader";
import { useAppSelector } from "@/lib/redux/hooks";
import VerticalMenuList from "./VerticalMenuList";

const StyledDrawer = styled(Drawer)<{ isOpen?: boolean }>(({ theme, isOpen }) => ({
  "& .MuiDrawer-paper": {
    width: isOpen ? 240 : 60,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
  },
}));

const VerticalMenu: React.FC = () => {
  const isOpen = useAppSelector((state) => state.pageData.openMenu);

  return (
    <StyledDrawer variant="permanent" isOpen={isOpen}>
      <VerticalMenuHeader isOpen={isOpen} />
      <Divider />
      <List>
        <VerticalMenuList open={isOpen} />
      </List>
    </StyledDrawer>
  );
};

export default VerticalMenu;
