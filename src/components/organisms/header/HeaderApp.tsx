import React from "react";
import { AppBar, Box, Toolbar, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import IconButton from "../../atoms/header/IconButton";
import UserMenu from "../../molecules/header/UserMenu";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { toggleMenu } from "@/lib/redux/slices/pageDataSlice";

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
}));

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.pageData.openMenu);
  const pageTitle = useAppSelector((state) => state.pageData.pageTitle);
  const theme = useTheme();

  const handleToggleDrawer = () => {
    dispatch(toggleMenu());
  };

  return (
    <StyledAppBar position="fixed" isOpen={isOpen}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <IconButton isOpen={isOpen} onClick={handleToggleDrawer} />
          <Typography
            sx={{
              fontSize: "20px", // Tamaño de fuente predeterminado para pantallas grandes
              [theme.breakpoints.down("sm")]: {
                fontSize: "16px", // Tamaño de fuente en pantallas móviles
              },
            }}
            noWrap
          >
            {pageTitle}
          </Typography>
        </Box>
        <UserMenu />
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;
