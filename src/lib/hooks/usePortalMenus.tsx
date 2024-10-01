import { useRouter } from "next/navigation";
import { Home as HomeIcon, AttachMoney as AttachMoneyIcon, Group as GroupIcon, Settings as SettingsIcon } from "@mui/icons-material";
import { Roles } from "@/constants/roles";
import routes from "../routes/routes";

export interface SubMenuType {
  text: string;
  onClick: () => void;
  roles: Roles[];
}

export interface MenuItemType {
  text: string;
  icon: React.ReactNode;
  roles: Roles[];
  onClick?: () => void;
  subMenuItems?: SubMenuType[];
}

export const usePortalMenus = (userRole: Roles): MenuItemType[] => {
  const router = useRouter();

  const allMenuItems: MenuItemType[] = [
    {
      text: "Overview",
      icon: <HomeIcon />,
      roles: [Roles.All],
      onClick: () => router.push(routes.web.portal.overview),
    },
    {
      text: "Financial",
      icon: <AttachMoneyIcon />,
      roles: [Roles.All],
      subMenuItems: [
        {
          text: "Invoices",
          onClick: () => router.push(routes.web.portal.financial.invoices),
          roles: [Roles.All],
        },
        {
          text: "Reports",
          onClick: () => router.push(routes.web.portal.financial.reports),
          roles: [Roles.All],
        },
      ],
    },
    {
      text: "Clients",
      icon: <GroupIcon />,
      roles: [Roles.Admin],
      onClick: () => router.push(routes.web.admin.clients.root),
    },
    {
      text: "Settings",
      icon: <SettingsIcon />,
      roles: [Roles.Admin],
      onClick: () => router.push(routes.web.admin.clients.root),
    },
  ];

  const filterItemsByRole = <T extends { roles: Roles[] }>(items: T[], role: Roles): T[] => {
    return items.filter((item) => item.roles.includes(Roles.All) || item.roles.includes(role));
  };

  return filterItemsByRole(allMenuItems, userRole);
};
