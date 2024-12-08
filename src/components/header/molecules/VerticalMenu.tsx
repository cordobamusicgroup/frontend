import React from "react";
import { Drawer, Divider, List, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import VerticalMenuHeader from "./VerticalMenuHeader";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import VerticalMenuList from "./VerticalMenuList";
import CloseIcon from "@mui/icons-material/Close";
import { toggleMenu } from "@/lib/redux/slices/pageDataSlice";
import useMediaQuery from "@mui/material/useMediaQuery";

const StyledDrawer = styled(Drawer)<{ isOpen?: boolean }>(({ theme, isOpen }) => ({
  "& .MuiDrawer-paper": {
    width: isOpen ? 240 : 60,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      display: isOpen ? "block" : "none",
    },
  },
}));

const VerticalMenu: React.FC = () => {
  const isOpen = useAppSelector((state) => state.pageData.openMenu);
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down("sm"));

  const handleClose = () => {
    dispatch(toggleMenu());
  };

  const handleItemClick = () => {
    if (isMobile) {
      dispatch(toggleMenu());
    }
  };

  return (
    <StyledDrawer variant="permanent" isOpen={isOpen}>
      {isMobile && isOpen && (
        <IconButton onClick={handleClose} sx={{ position: "absolute", top: 10, right: 2 }}>
          <CloseIcon />
        </IconButton>
      )}
      <VerticalMenuHeader isOpen={isOpen} />
      <Divider />
      <List>
        <VerticalMenuList open={isOpen} onItemClick={handleItemClick} />
      </List>
    </StyledDrawer>
  );
};

export default VerticalMenu;
