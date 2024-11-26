// menuItems.tsx
import React from "react";
import { AccountBalance, AccountCircle, ExitToApp } from "@mui/icons-material";
import { useAuth } from "../hooks/useAuth";

interface MenuItemType {
  text: string;
  icon: React.ReactNode;
  onClick: () => void;
}

// TODO: [CMGDEV-8]  Refactorizar este hook para que sea más legible y mantenible a largo plazo

export const useUserMenuItems = (): MenuItemType[] => {
  const auth = useAuth();

  return [
    {
      text: "Profile",
      icon: <AccountCircle fontSize="small" />,
      onClick: () => {
        console.log("Profile clicked");
      },
    },
    {
      text: "Bank Information",
      icon: <AccountBalance fontSize="small" />,
      onClick: () => {
        console.log("Profile clicked");
      },
    },
    {
      text: "Logout",
      icon: <ExitToApp fontSize="small" />,
      onClick: () => {
        auth.logout();
      },
    },
  ];
};
