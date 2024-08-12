import React, { useState } from "react";
import { List, Divider, styled } from "@mui/material";
import { useAppSelector } from "@/lib/redux/hooks";
import { usePortalMenuItems } from "@/lib/hooks/usePortalMenu";
import { usePortalAdminMenuItems } from "@/lib/hooks/useAdminMenu";
import VerticalMenuItem from "./VerticalMenuItem";

interface VerticalDrawerListProps {
  open: boolean;
}

const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  fontWeight: "bold",
  fontSize: "13px",
  color: theme.palette.text.secondary,
  textTransform: "uppercase",
}));

const VerticalMenuList: React.FC<VerticalDrawerListProps> = ({ open }) => {
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const user = useAppSelector((state) => state.user.userData);

  const menuItems = usePortalMenuItems(user?.role);
  const adminMenuItems = usePortalAdminMenuItems(user?.role);

  const handleSubMenuClick = (text: string) => {
    setOpenSubMenu(openSubMenu === text ? null : text);
  };

  return (
    <List>
      {menuItems.map((item) => (
        <VerticalMenuItem key={item.text} item={item} open={open} isSubMenuOpen={openSubMenu === item.text} onClick={() => (item.subMenuItems && item.subMenuItems.length > 0 ? handleSubMenuClick(item.text) : item.onClick?.())} onSubMenuClick={() => handleSubMenuClick(item.text)} />
      ))}

      {adminMenuItems.length > 0 && (
        <>
          {open && <StyledDivider>Admin Menu</StyledDivider>}
          {adminMenuItems.map((item) => (
            <VerticalMenuItem key={item.text} item={item} open={open} isSubMenuOpen={openSubMenu === item.text} onClick={() => (item.subMenuItems && item.subMenuItems.length > 0 ? handleSubMenuClick(item.text) : item.onClick?.())} onSubMenuClick={() => handleSubMenuClick(item.text)} />
          ))}
        </>
      )}
    </List>
  );
};

export default VerticalMenuList;
