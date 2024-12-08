import React from "react";
import { styled } from "@mui/material/styles";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { toggleMenu } from "@/lib/redux/slices/pageDataSlice";
import UserMenu from "./molecules/UserMenu";
import { AppBar, Toolbar, Box } from "@mui/material";
import IconButton from "../global/atoms/IconButton";

const StyledAppBar = styled(AppBar)<{ isOpen?: boolean }>(({ theme, isOpen }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(isOpen && {
    width: `calc(100% - 240px)`,
    marginLeft: `240px`,
  }),
  ...(!isOpen && {
    width: `calc(100% - 60px)`,
    marginLeft: `60px`,
  }),
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    marginLeft: 0,
  },
}));

const HeaderLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.pageData.openMenu);

  const handleToggleDrawer = () => {
    dispatch(toggleMenu());
  };

  return (
    <StyledAppBar position="fixed" isOpen={isOpen}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", background: "linear-gradient(28deg, rgba(9,54,95,1) 17%, rgba(5,42,76,1) 57%, rgba(0,27,51,1) 100%)" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <IconButton isOpen={isOpen} onClick={handleToggleDrawer} />
        </Box>
        <UserMenu />
      </Toolbar>
    </StyledAppBar>
  );
};

export default HeaderLayout;
