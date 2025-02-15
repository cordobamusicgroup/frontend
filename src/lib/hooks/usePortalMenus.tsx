import { useRouter } from "next/navigation";
import { Home as HomeIcon, AttachMoney as AttachMoneyIcon, Group as GroupIcon, Settings as SettingsIcon, LibraryMusic, Group, SupervisedUserCircle, ContactEmergency, Assessment } from "@mui/icons-material";
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
          text: "Payments & Operations",
          onClick: () => router.push(routes.web.portal.financial.payments),
          roles: [Roles.All],
        },
        {
          text: "Financial Reports",
          onClick: () => router.push(routes.web.portal.financial.reports),
          roles: [Roles.All],
        },
      ],
    },
    {
      text: "Clients",
      icon: <ContactEmergency />,
      roles: [Roles.Admin],
      onClick: () => router.push(routes.web.admin.clients.root),
    },
    {
      text: "Labels",
      icon: <LibraryMusic />,
      roles: [Roles.Admin],
      onClick: () => router.push(routes.web.admin.labels.root),
    },
    {
      text: "Users",
      icon: <SupervisedUserCircle />,
      roles: [Roles.Admin],
      onClick: () => router.push(routes.web.admin.users.root),
    },
    {
      text: "Reports",
      icon: <Assessment />,
      roles: [Roles.Admin],
      subMenuItems: [
        {
          text: "Link Missing Reports",
          onClick: () => router.push(routes.web.admin.reports.unlinked.root),
          roles: [Roles.Admin],
        },
      ],
    },
  ];

  const filterItemsByRole = <T extends { roles: Roles[] }>(items: T[], role: Roles): T[] => {
    return items.filter((item) => item.roles.includes(Roles.All) || item.roles.includes(role));
  };

  return filterItemsByRole(allMenuItems, userRole);
};
