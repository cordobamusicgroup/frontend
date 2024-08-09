// components/organisms/DrawerList.tsx

import React, { useState } from "react";
import { ListItem, ListItemIcon, ListItemText, Divider, List, Collapse, styled } from "@mui/material";
import { ExpandLess, ExpandMore, SubdirectoryArrowRight as SubdirectoryArrowRightIcon } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setLoading } from "@/lib/redux/slices/loaderSlice";
import FullScreenLoader from "../loaders/FullScreenLoader";
import { MenuItemType, usePortalMenuItems } from "@/lib/hooks/usePortalMenu";
import { usePortalAdminMenuItems } from "@/lib/hooks/useAdminMenu";

interface DrawerListProps {
  open: boolean;
}

const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  fontWeight: "bold",
  fontSize: "13px",
  color: theme.palette.text.secondary,
  textTransform: "uppercase",
}));

interface MenuItemProps {
  item: MenuItemType;
  open: boolean;
  isSubMenuOpen: boolean;
  onClick: () => void;
  onSubMenuClick: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, open, isSubMenuOpen, onClick, onSubMenuClick }) => {
  return (
    <>
      <ListItem button onClick={onClick}>
        <ListItemIcon>{item.icon}</ListItemIcon>
        {open && <ListItemText primary={item.text} />}
        {open && item.subMenuItems && item.subMenuItems.length > 0 && (isSubMenuOpen ? <ExpandLess /> : <ExpandMore />)}
      </ListItem>
      {item.subMenuItems && item.subMenuItems.length > 0 && (
        <Collapse in={isSubMenuOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.subMenuItems.map((subItem) => (
              <ListItem button key={subItem.text} onClick={subItem.onClick} sx={{ pl: 4 }}>
                <ListItemIcon>
                  <SubdirectoryArrowRightIcon />
                </ListItemIcon>
                <ListItemText primary={subItem.text} />
              </ListItem>
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

const DrawerList: React.FC<DrawerListProps> = ({ open }) => {
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const user = useAppSelector((state) => state.user.userData);
  const loading = useAppSelector((state) => state.loader.loading);
  const dispatch = useAppDispatch();

  const menuItems = usePortalMenuItems(user?.role);
  const adminMenuItems = usePortalAdminMenuItems(user?.role);

  const handleSubMenuClick = (text: string) => {
    setOpenSubMenu(openSubMenu === text ? null : text);
  };

  return (
    <>
      {loading && <FullScreenLoader open={true} />}
      <List>
        {menuItems.map((item) => (
          <MenuItem key={item.text} item={item} open={open} isSubMenuOpen={openSubMenu === item.text} onClick={() => (item.subMenuItems && item.subMenuItems.length > 0 ? handleSubMenuClick(item.text) : item.onClick?.())} onSubMenuClick={() => handleSubMenuClick(item.text)} />
        ))}

        {adminMenuItems.length > 0 && (
          <>
            {open && <StyledDivider>Admin Menu</StyledDivider>}
            {adminMenuItems.map((item) => (
              <MenuItem key={item.text} item={item} open={open} isSubMenuOpen={openSubMenu === item.text} onClick={() => (item.subMenuItems && item.subMenuItems.length > 0 ? handleSubMenuClick(item.text) : item.onClick?.())} onSubMenuClick={() => handleSubMenuClick(item.text)} />
            ))}
          </>
        )}
      </List>
    </>
  );
};

export default DrawerList;
