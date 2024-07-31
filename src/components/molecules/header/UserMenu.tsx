import React, { useState } from "react";
import { Menu, MenuItem, ListItemIcon, ListItemText, Box, Typography, IconButton } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useMenuItems } from "@/lib/data/menuItems";
import { useAppSelector } from "@/lib/redux/hooks";

interface UserMenuProps {
  username: string;
  clientId: string;
}

const UserMenu: React.FC<UserMenuProps> = ({ username, clientId }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const menuItems = useMenuItems(); // Obtén los items del menú
  const userData = useAppSelector((state) => state.user.userData);

  return (
    <Box display="flex" alignItems="center">
      {!isMobile && (
        <Box
          mr={2}
          textAlign="right"
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          <Typography variant="body1">{username}</Typography>
          <Typography variant="body2">Client ID: {clientId}</Typography>
        </Box>
      )}
      <IconButton edge="end" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleMenu} color="inherit">
        <AccountCircle />
      </IconButton>
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
