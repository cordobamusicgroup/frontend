"use client";
import React, { useState } from "react";
import { Menu, MenuItem, ListItemIcon, ListItemText, Box, Typography, IconButton } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useAppSelector } from "@/lib/redux/hooks";
import LoadingSpinner from "@/components/global/atoms/LoadingSpinner";
import { useUserMenuItems } from "@/lib/menus/userMenuItems";

/**
 * UserMenu component displays a user menu with options for the current user.
 *
 * @returns {React.FC} The UserMenu component.
 */
const UserMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const menuItems = useUserMenuItems(); // Obtén los items del menú
  const userData = useAppSelector((state) => state.user.userData);

  /**
   * Handles the opening of the user menu.
   *
   * @param {React.MouseEvent<HTMLElement>} event - The click event.
   */
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Handles the closing of the user menu.
   */
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box display="flex" alignItems="center">
      {/* Show user info only on desktop */}
      {!isMobile && (
        <Box
          mr={2}
          textAlign="right"
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {userData ? (
            <>
              <Typography variant="body1">{userData.username}</Typography>
              <Typography variant="body2">Client ID: {userData.clientId || "Unknown"}</Typography>
            </>
          ) : (
            <LoadingSpinner size={25} />
          )}
        </Box>
      )}

      {/* User icon button to open menu */}
      <IconButton edge="end" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleMenu} color="inherit">
        <AccountCircle />
      </IconButton>

      {/* User menu */}
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: "300px",
            [theme.breakpoints.down("sm")]: {
              maxHeight: "200px",
            },
          },
        }}
      >
        {menuItems.map((item, index) => (
          <MenuItem key={index} onClick={item.onClick}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default UserMenu;
