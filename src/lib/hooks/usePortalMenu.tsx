// lib/hooks/usePortalMenuItems.ts

import { useRouter } from "next/navigation";
import { Home as HomeIcon, AttachMoney as AttachMoneyIcon, Settings as SettingsIcon, Security as SecurityIcon, AssessmentOutlined, SubdirectoryArrowRight as SubdirectoryArrowRightIcon } from "@mui/icons-material";
import webRoutes from "../routes/webRoutes";
import { filterItemsByRole } from "../utils/portalMenuUtils";

export interface SubMenuType {
  text: string;
  onClick: () => void;
  roles: string[];
}

export interface MenuItemType {
  text: string;
  icon: React.ReactNode;
  roles: string[];
  onClick?: () => void;
  subMenuItems?: SubMenuType[];
}

export const usePortalMenuItems = (userRole: string): MenuItemType[] => {
  const router = useRouter();

  const menuItems: MenuItemType[] = [
    {
      text: "Overview",
      icon: <HomeIcon />,
      roles: ["USER", "ADMIN", "ALL"],
      onClick: () => router.push(webRoutes.portal.overview),
    },
    {
      text: "Financial",
      icon: <AttachMoneyIcon />,
      roles: ["USER", "ADMIN", "ALL"],
      onClick: () => router.push(webRoutes.portal.financial),
      subMenuItems: [
        {
          text: "Invoices",
          onClick: () => router.push(webRoutes.portal.financial),
          roles: ["USER", "ADMIN"],
        },
        {
          text: "Reports",
          onClick: () => router.push(webRoutes.portal.overview),
          roles: ["ADMIN"],
        },
      ],
    },
  ];

  return filterItemsByRole(menuItems, userRole);
};
