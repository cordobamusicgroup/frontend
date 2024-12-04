import React from "react";
import { ListItem, ListItemIcon, ListItemText, Collapse, List } from "@mui/material";
import { ExpandLess, ExpandMore, SubdirectoryArrowRight as SubdirectoryArrowRightIcon } from "@mui/icons-material";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { MenuItemType } from "@/lib/hooks/usePortalMenus";
interface VerticalMenuItemProps {
  item: MenuItemType;
  open: boolean;
  isSubMenuOpen: boolean;
  onClick: () => void;
  onSubMenuClick: () => void;
}

const VerticalMenuItem: React.FC<VerticalMenuItemProps> = ({ item, open, isSubMenuOpen, onClick, onSubMenuClick }) => {
  return (
    <>
      <ListItem button onClick={onClick}>
        <ListItemIcon>{item.icon}</ListItemIcon>
        {open && <ListItemText primary={item.text} />}
        {open && item.subMenuItems && item.subMenuItems.length > 0 && (isSubMenuOpen ? <ExpandLess /> : <ExpandMore />)}
      </ListItem>
      {item.subMenuItems && item.subMenuItems.length > 0 && (
        <Collapse in={open && isSubMenuOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.subMenuItems.map((subItem) => (
              <ListItem button key={subItem.text} onClick={subItem.onClick} sx={{ pl: 2 }}>
                <ListItemIcon>
                  <ArrowForwardOutlinedIcon />
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

export default VerticalMenuItem;
