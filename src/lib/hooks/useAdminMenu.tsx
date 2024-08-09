// lib/hooks/usePortalAdminMenuItems.ts

import { useRouter } from "next/navigation";
import { Home as HomeIcon, AttachMoney as AttachMoneyIcon, Settings as SettingsIcon, Security as SecurityIcon, AssessmentOutlined, SubdirectoryArrowRight as SubdirectoryArrowRightIcon } from "@mui/icons-material";
import { MenuItemType } from "./usePortalMenu";
import { filterItemsByRole } from "../utils/portalMenuUtils";

export const usePortalAdminMenuItems = (userRole: string): MenuItemType[] => {
  const router = useRouter();

  const adminMenuItems: MenuItemType[] = [
    {
      text: "Settings",
      icon: <SettingsIcon />,
      roles: ["ADMIN"],
      onClick: () => router.push("/settings"),
      subMenuItems: [
        {
          text: "General",
          onClick: () => router.push("/settings/general"),
          roles: ["ADMIN"],
        },
        {
          text: "Security",
          onClick: () => router.push("/settings/security"),
          roles: ["ADMIN"],
        },
      ],
    },
    {
      text: "Security",
      icon: <SecurityIcon />,
      roles: ["ADMIN"],
      subMenuItems: [
        {
          text: "User Management",
          onClick: () => router.push("/security/user-management"),
          roles: ["ADMIN"],
        },
        {
          text: "Permissions",
          onClick: () => router.push("/security/permissions"),
          roles: ["ADMIN"],
        },
      ],
    },
  ];

  return filterItemsByRole(adminMenuItems, userRole);
};
