import { useRouter } from "next/navigation";
import { Home as HomeIcon, AttachMoney as AttachMoneyIcon, Group as GroupIcon, Settings as SettingsIcon } from "@mui/icons-material";
import webRoutes from "../routes/webRoutes";

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

/**
 * Hook to generate menu items based on user role.
 * Combines both admin and portal menu items into a single source.
 *
 * @param userRole - The role of the current user (e.g., "ADMIN", "USER").
 * @returns Filtered menu items based on the user's role.
 */
export const useMenus = (userRole: string): MenuItemType[] => {
  const router = useRouter();

  // All menu items (both admin and normal users)
  const allMenuItems: MenuItemType[] = [
    {
      text: "Overview",
      icon: <HomeIcon />,
      roles: ["ALL"], // Accessible by all roles
      onClick: () => router.push(webRoutes.portal.overview),
    },
    {
      text: "Financial",
      icon: <AttachMoneyIcon />,
      roles: ["ALL"],
      subMenuItems: [
        {
          text: "Invoices",
          onClick: () => router.push(webRoutes.portal.financial.invoices),
          roles: ["ALL"],
        },
        {
          text: "Reports",
          onClick: () => router.push(webRoutes.portal.financial.reports),
          roles: ["ALL"],
        },
      ],
    },
    // Admin-specific menu items
    {
      text: "Clients",
      icon: <GroupIcon />,
      roles: ["ADMIN"], // Only accessible by ADMIN
      onClick: () => router.push(webRoutes.admin.clients),
    },
    {
      text: "Settings",
      icon: <SettingsIcon />,
      roles: ["ADMIN"], // Only accessible by ADMIN
      onClick: () => router.push(webRoutes.admin.clients),
    },
  ];

  // Filter menu items by the user's role, allowing "ALL" or specific roles
  const filterItemsByRole = <T extends { roles: string[] }>(items: T[], role: string): T[] => {
    return items.filter((item) => item.roles.includes("ALL") || item.roles.includes(role));
  };

  // Filter the items based on userRole
  return filterItemsByRole(allMenuItems, userRole);
};
