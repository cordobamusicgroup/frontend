// menuItems.tsx
import React from "react";
import { AccountBalance, AccountCircle, ExitToApp } from "@mui/icons-material";
import { useAppDispatch } from "../redux/hooks";
import { logout } from "../redux/slices/authSlice";
import { useRouter } from "next/navigation";

interface MenuItemType {
  text: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export const useMenuItems = (): MenuItemType[] => {
  const dispatch = useAppDispatch();
  const router = useRouter();

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
        dispatch(logout({ router }));
      },
    },
  ];
};
