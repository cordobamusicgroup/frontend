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
  onSubItemClick: () => void;
}

const VerticalMenuItem: React.FC<VerticalMenuItemProps> = ({ item, open, isSubMenuOpen, onClick, onSubMenuClick, onSubItemClick }) => {
  return (
    <>
      <ListItem button onClick={onClick}>
        <ListItemIcon sx={{ mr: 2, minWidth: "auto" }}>{item.icon}</ListItemIcon> {/* Ajuste: menor margen entre icono y texto */}
        {open && (
          <ListItemText
            primary={item.text}
            primaryTypographyProps={{ fontSize: "14px" }} // Ajuste: letra más pequeña para menú principal
          />
        )}
        {open && item.subMenuItems && item.subMenuItems.length > 0 && (isSubMenuOpen ? <ExpandLess /> : <ExpandMore />)}
      </ListItem>
      {item.subMenuItems && item.subMenuItems.length > 0 && (
        <Collapse in={open && isSubMenuOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.subMenuItems.map((subItem) => (
              <ListItem
                button
                key={subItem.text}
                onClick={() => {
                  subItem.onClick?.();
                  onSubItemClick();
                }}
                sx={{ pl: 3, py: 0.5 }} // Ajuste: menor padding vertical
              >
                <ListItemIcon sx={{ mr: 2, minWidth: "auto" }}>
                  {" "}
                  {/* Ajuste: remueve el gap entre icono y texto */}
                  <ArrowForwardOutlinedIcon sx={{ fontSize: "1rem" }} /> {/* Ajuste: ícono más pequeño */}
                </ListItemIcon>
                <ListItemText
                  primary={subItem.text}
                  primaryTypographyProps={{ fontSize: "14px" }} // Ajuste: letra más pequeña
                />
              </ListItem>
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

export default VerticalMenuItem;
