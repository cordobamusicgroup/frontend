// menuItems.tsx
import React from "react";
import { AccountBalance, AccountCircle, ExitToApp } from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";

interface MenuItemType {
  text: string;
  icon: React.ReactNode;
  onClick: () => void;
}

// TODO: [CMGDEV-8]  Refactorizar este hook para que sea más legible y mantenible a largo plazo

const createMenuItem = (text: string, icon: React.ReactNode, onClick: () => void): MenuItemType => ({
  text,
  icon,
  onClick,
});

export const useUserMenuItems = (): MenuItemType[] => {
  const auth = useAuth();

  return [
    createMenuItem("Logout", <ExitToApp fontSize="small" />, () => {
      auth.logout();
    }),
  ];
};
