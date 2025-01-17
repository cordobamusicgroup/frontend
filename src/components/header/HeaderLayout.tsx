import React from "react";
import { styled } from "@mui/material/styles";
import UserMenu from "./molecules/UserMenu";
import { AppBar, Toolbar, Box } from "@mui/material";
import IconButton from "../global/atoms/IconButton";
import { useAppStore } from "@/lib/zustand/zustandStore";

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "isMenuOpen",
})<{ isMenuOpen: boolean }>(({ theme, isMenuOpen }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: isMenuOpen ? `calc(100% - 240px)` : `calc(100% - 60px)`,
  marginLeft: isMenuOpen ? `240px` : `60px`,
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    marginLeft: 0,
  },
}));

const HeaderLayout: React.FC = () => {
  const isMenuOpen = useAppStore.pageData((state) => state.openMenu);
  const { toggleMenu } = useAppStore.pageData.getState();

  const handleToggleDrawer = () => {
    toggleMenu();
  };

  return (
    <StyledAppBar position="fixed" isMenuOpen={isMenuOpen}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          background: "linear-gradient(28deg, rgba(9,54,95,1) 17%, rgba(5,42,76,1) 57%, rgba(0,27,51,1) 100%)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <IconButton isOpen={isMenuOpen} onClick={handleToggleDrawer} />
        </Box>
        <UserMenu />
      </Toolbar>
    </StyledAppBar>
  );
};

export default HeaderLayout;
