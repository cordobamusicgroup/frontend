// lib/hooks/usePortalMenuItems.ts

import { useRouter } from "next/navigation";
import { Home as HomeIcon, AttachMoney as AttachMoneyIcon, Settings as SettingsIcon, Security as SecurityIcon, AssessmentOutlined, SubdirectoryArrowRight as SubdirectoryArrowRightIcon } from "@mui/icons-material";
import DescriptionIcon from "@mui/icons-material/Description";
import webRoutes from "../routes/webRoutes";
import { filterItemsByRole } from "../utils/portalMenuUtils";
import { useTranslations } from "next-intl";

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
  const t = useTranslations();

  const menuItems: MenuItemType[] = [
    {
      text: t("portal.pages.overview"),
      icon: <HomeIcon />,
      roles: ["ALL"],
      onClick: () => router.push(webRoutes.portal.overview),
    },
    {
      text: t("portal.pages.financial.title"),
      icon: <AttachMoneyIcon />,
      roles: ["ALL"],
      subMenuItems: [
        {
          text: t("portal.pages.financial.invoices"),
          onClick: () => router.push(webRoutes.portal.financial.invoices),
          roles: ["ALL"],
        },
        {
          text: t("portal.pages.financial.reports"),
          onClick: () => router.push(webRoutes.portal.financial.reports),
          roles: ["ALL"],
        },
      ],
    },
  ];

  return filterItemsByRole(menuItems, userRole);
};
