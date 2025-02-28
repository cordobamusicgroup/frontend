import React from "react";
import { ListItem, ListItemIcon, ListItemText, Collapse, List } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { MenuItemType } from "@/lib/hooks/usePortalMenus";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface VerticalMenuItemProps {
  item: MenuItemType;
  open: boolean;
  isSubMenuOpen: boolean;
  onClick: () => void;
  onSubMenuClick: () => void;
  onSubItemClick: () => void;
}

const VerticalMenuItem: React.FC<VerticalMenuItemProps> = ({ item, open, isSubMenuOpen, onClick, onSubMenuClick, onSubItemClick }) => {
  const router = useRouter();
  const shouldUseLink = !!item.path && (!item.subMenuItems || item.subMenuItems.length === 0);

  const handleMainItemClick = (e: React.MouseEvent) => {
    if (e.button === 0) {
      // Only handle left clicks
      e.preventDefault();

      // Navigate to path if available and no submenus
      if (item.path && (!item.subMenuItems || item.subMenuItems.length === 0)) {
        router.push(item.path);
      }

      onClick();
    }
  };

  const handleSubItemClick = (e: React.MouseEvent, path: string) => {
    if (e.button === 0) {
      e.preventDefault();
      router.push(path);
      onSubItemClick();
    }
  };

  const mainItemContent = (
    <>
      <ListItemIcon sx={{ mr: 2, minWidth: "auto" }}>{React.isValidElement(item.icon) ? React.cloneElement(item.icon as React.ReactElement, { sx: { fontSize: "1.3rem" } }) : item.icon}</ListItemIcon>
      {open && <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: "14px" }} />}
      {open && item.subMenuItems && item.subMenuItems.length > 0 && (isSubMenuOpen ? <ExpandLess /> : <ExpandMore />)}
    </>
  );

  return (
    <>
      {shouldUseLink ? (
        <ListItem button component={Link} href={item.path || "#"} onClick={handleMainItemClick}>
          {mainItemContent}
        </ListItem>
      ) : (
        <ListItem button onClick={onClick}>
          {mainItemContent}
        </ListItem>
      )}

      {item.subMenuItems && item.subMenuItems.length > 0 && (
        <Collapse in={open && isSubMenuOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.subMenuItems.map((subItem) => (
              <ListItem button key={subItem.text} component={Link} href={subItem.path} onClick={(e: React.MouseEvent) => handleSubItemClick(e, subItem.path)} sx={{ pl: 3, py: 0.5 }}>
                <ListItemIcon sx={{ mr: 2, minWidth: "auto" }}>
                  <ArrowForwardOutlinedIcon sx={{ fontSize: "1rem" }} />
                </ListItemIcon>
                <ListItemText primary={subItem.text} primaryTypographyProps={{ fontSize: "14px" }} />
              </ListItem>
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

export default VerticalMenuItem;
