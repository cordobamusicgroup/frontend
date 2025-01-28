import React from "react";
import { Drawer, Divider, List, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import VerticalMenuHeader from "./VerticalMenuHeader";
import VerticalMenuList from "./VerticalMenuList";
import CloseIcon from "@mui/icons-material/Close";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useAppStore } from "@/lib/zustand/zustandStore";

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "isMenuOpen",
})<{ isMenuOpen: boolean }>(({ theme, isMenuOpen }) => ({
  "& .MuiDrawer-paper": {
    width: isMenuOpen ? 240 : 60,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      display: isMenuOpen ? "block" : "none",
    },
  },
}));

const VerticalMenu: React.FC = () => {
  const isMenuOpen = useAppStore.pageData((state) => state.openMenu);
  const { toggleMenu } = useAppStore.pageData.getState();

  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down("sm"));

  const handleClose = () => {
    toggleMenu();
  };

  const handleItemClick = () => {
    if (isMobile) {
      toggleMenu();
    }
  };

  return (
    <StyledDrawer variant="permanent" isMenuOpen={isMenuOpen}>
      {isMobile && isMenuOpen && (
        <IconButton onClick={handleClose} sx={{ position: "absolute", top: 10, right: 2 }}>
          <CloseIcon />
        </IconButton>
      )}
      <VerticalMenuHeader />
      <Divider />
      <List>
        <VerticalMenuList onItemClick={handleItemClick} />
      </List>
    </StyledDrawer>
  );
};

export default VerticalMenu;
