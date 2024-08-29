// lib/hooks/usePortalAdminMenuItems.ts

import { useRouter } from "next/navigation";
import { Home as HomeIcon, AttachMoney as AttachMoneyIcon, Settings as SettingsIcon, Security as SecurityIcon, AssessmentOutlined, SubdirectoryArrowRight as SubdirectoryArrowRightIcon } from "@mui/icons-material";
import GroupIcon from "@mui/icons-material/Group";
import { MenuItemType } from "./usePortalMenu";
import { filterItemsByRole } from "../utils/portalMenuUtils";
import webRoutes from "../routes/webRoutes";

export const usePortalAdminMenuItems = (userRole: string): MenuItemType[] => {
  const router = useRouter();

  const adminMenuItems: MenuItemType[] = [
    {
      text: "Clients",
      icon: <GroupIcon />,
      roles: ["ADMIN"],
      subMenuItems: [
        {
          text: "Manage Clients",
          onClick: () => router.push(webRoutes.admin.clients),
          roles: ["ADMIN"],
        },
      ],
    },
  ];

  return filterItemsByRole(adminMenuItems, userRole);
};