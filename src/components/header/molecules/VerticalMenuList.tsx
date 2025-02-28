import React from "react";
import { List, Divider, styled } from "@mui/material";
import VerticalMenuItem from "./VerticalMenuItem";
import { usePortalMenus } from "@/lib/hooks/usePortalMenus";
import { Roles } from "@/constants/roles";
import { useAppStore } from "@/lib/zustand/zustandStore";
import { useRouter } from "next/navigation";

interface VerticalDrawerListProps {
  onItemClick: () => void;
}

const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  fontWeight: "bold",
  fontSize: "13px",
  color: theme.palette.text.secondary,
  textTransform: "uppercase",
}));

const VerticalMenuList: React.FC<VerticalDrawerListProps> = ({ onItemClick }) => {
  const router = useRouter();
  const user = useAppStore.user((state) => state.userData);
  const openSubMenu = useAppStore.pageData((state) => state.openSubMenu);
  const toggleSubMenu = useAppStore.pageData((state) => state.toggleSubMenu);
  const isOpen = useAppStore.pageData((state) => state.openMenu);

  // Obtenemos los ítems del menú basados en el rol del usuario
  const menuItems = usePortalMenus(user?.role);

  const handleSubMenuClick = (text: string) => {
    toggleSubMenu(text);
  };

  const handleNavigation = (path?: string) => {
    if (path) {
      router.push(path);
      onItemClick();
    }
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
          open={isOpen}
          isSubMenuOpen={openSubMenu === item.text}
          onClick={() => {
            if (item.subMenuItems && item.subMenuItems.length > 0) {
              handleSubMenuClick(item.text);
            } else {
              handleNavigation(item.path);
            }
          }}
          onSubMenuClick={() => handleSubMenuClick(item.text)}
          onSubItemClick={onItemClick}
        />
      ))}

      {/* Si hay ítems de administrador, mostramos el divisor "Admin Menu" y los ítems */}
      {adminItems.length > 0 && (
        <>
          {isOpen && <StyledDivider>Admin Menu</StyledDivider>}
          {adminItems.map((item) => (
            <VerticalMenuItem
              key={item.text}
              item={item}
              open={isOpen}
              isSubMenuOpen={openSubMenu === item.text}
              onClick={() => {
                if (item.subMenuItems && item.subMenuItems.length > 0) {
                  handleSubMenuClick(item.text);
                } else {
                  handleNavigation(item.path);
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
