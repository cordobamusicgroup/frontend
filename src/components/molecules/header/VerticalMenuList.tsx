import React, { useState } from "react";
import { List, Divider, styled } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { usePortalMenuItems } from "@/lib/hooks/usePortalMenu";
import { usePortalAdminMenuItems } from "@/lib/hooks/useAdminMenu";
import VerticalMenuItem from "./VerticalMenuItem";
import { toggleSubMenu } from "@/lib/redux/slices/pageDataSlice";

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
  const user = useAppSelector((state) => state.user.userData);
  const dispatch = useAppDispatch();
  const openSubMenu = useAppSelector((state) => state.pageData.openSubMenu);
  const menuItems = usePortalMenuItems(user?.role);
  const adminMenuItems = usePortalAdminMenuItems(user?.role);

  const handleSubMenuClick = (text: string) => {
    dispatch(toggleSubMenu(text));
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
