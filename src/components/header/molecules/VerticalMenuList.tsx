import React from "react";
import { List, Divider, styled } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import VerticalMenuItem from "./VerticalMenuItem";
import { toggleSubMenu } from "@/lib/redux/slices/pageDataSlice";
import { usePortalMenus } from "@/lib/hooks/usePortalMenus";
import { Roles } from "@/constants/roles";

interface VerticalDrawerListProps {
  open: boolean;
  onItemClick: () => void;
}

const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  fontWeight: "bold",
  fontSize: "13px",
  color: theme.palette.text.secondary,
  textTransform: "uppercase",
}));

const VerticalMenuList: React.FC<VerticalDrawerListProps> = ({ open, onItemClick }) => {
  const user = useAppSelector((state) => state.user.userData); // Obtenemos los datos del usuario desde Redux
  const dispatch = useAppDispatch();
  const openSubMenu = useAppSelector((state) => state.pageData.openSubMenu);

  // Obtenemos los ítems del menú basados en el rol del usuario
  const menuItems = usePortalMenus(user?.role);

  const handleSubMenuClick = (text: string) => {
    dispatch(toggleSubMenu(text));
  };

  // Separar los ítems de admin de los ítems generales
  const adminItems = menuItems.filter((item) => item.roles.includes(Roles.Admin));
  const generalItems = menuItems.filter((item) => !item.roles.includes(Roles.Admin));

  return (
    <List>
      {/* Renderizamos los ítems generales del menú */}
      {generalItems.map((item) => (
        <VerticalMenuItem
          key={item.text}
          item={item}
          open={open}
          isSubMenuOpen={openSubMenu === item.text}
          onClick={() => {
            if (item.subMenuItems && item.subMenuItems.length > 0) {
              handleSubMenuClick(item.text);
            } else {
              item.onClick?.();
              onItemClick();
            }
          }}
          onSubMenuClick={() => handleSubMenuClick(item.text)}
          onSubItemClick={onItemClick}
        />
      ))}

      {/* Si hay ítems de administrador, mostramos el divisor "Admin Menu" y los ítems */}
      {adminItems.length > 0 && (
        <>
          {open && <StyledDivider>Admin Menu</StyledDivider>}
          {adminItems.map((item) => (
            <VerticalMenuItem
              key={item.text}
              item={item}
              open={open}
              isSubMenuOpen={openSubMenu === item.text}
              onClick={() => {
                if (item.subMenuItems && item.subMenuItems.length > 0) {
                  handleSubMenuClick(item.text);
                } else {
                  item.onClick?.();
                  onItemClick();
                }
              }}
              onSubMenuClick={() => handleSubMenuClick(item.text)}
              onSubItemClick={onItemClick}
            />
          ))}
        </>
      )}
    </List>
  );
};

export default VerticalMenuList;
