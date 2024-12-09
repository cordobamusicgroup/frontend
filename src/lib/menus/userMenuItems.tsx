// menuItems.tsx
import React from "react";
import { AccountBalance, AccountCircle, ExitToApp } from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import routes from "../routes/routes";

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
  const router = useRouter();

  return [
    createMenuItem("Profile", <AccountCircle fontSize="small" />, () => {
      router.push(routes.web.portal.user.profile);
    }),
    createMenuItem("Logout", <ExitToApp fontSize="small" />, () => {
      auth.logout();
    }),
  ];
};
