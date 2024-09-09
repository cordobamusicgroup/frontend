// lib/hooks/usePortalAdminMenuItems.ts

import { useRouter } from "next/navigation";
import { Home as HomeIcon, AttachMoney as AttachMoneyIcon, Settings as SettingsIcon, Security as SecurityIcon, AssessmentOutlined, SubdirectoryArrowRight as SubdirectoryArrowRightIcon } from "@mui/icons-material";
import GroupIcon from "@mui/icons-material/Group";
import { MenuItemType } from "./usePortalMenu";
import { filterItemsByRole } from "../menus/portalMenuUtils";
import webRoutes from "../routes/webRoutes";
import { useTranslations } from "next-intl";

export const usePortalAdminMenuItems = (userRole: string): MenuItemType[] => {
  const router = useRouter();
  const t = useTranslations("menus");

  const adminMenuItems: MenuItemType[] = [
    {
      text: t("clients"),
      icon: <GroupIcon />,
      onClick: () => router.push(webRoutes.admin.clients),
      roles: ["ADMIN"],
    },
  ];

  return filterItemsByRole(adminMenuItems, userRole);
};
