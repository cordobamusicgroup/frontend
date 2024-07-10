import React, { useState } from "react";
import { Menu, MenuItem, ListItemIcon, ListItemText, Box, Typography, IconButton } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { menuItems } from "@/data/userMenuItems";
import useMediaQuery from "@mui/material/useMediaQuery";

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

  return (
    <Box display="flex" alignItems="center">
      {!isMobile && (
        <Box
          mr={2}
          textAlign="right"
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: { xs: "80px", sm: "150px", md: "200px" }, // Ajustar según las necesidades
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
            maxHeight: "300px", // Limita la altura máxima del menú
            [theme.breakpoints.down("sm")]: {
              maxHeight: "200px", // Limita la altura máxima del menú en pantallas pequeñas
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
