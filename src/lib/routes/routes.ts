import { Roles } from "@/constants/roles";

export interface ProtectedRouteConfig {
  path: string;
  roles: Roles[] | Roles.All;
}

const routes = {
  api: {
    auth: {
      login: "/auth/login",
      me: "/auth/me",
    },
    clients: {
      root: "/clients",
    },
    labels: {
      root: "/labels",
    },

    countries: "/countries",
  },
  web: {
    login: "/auth/login",
    portal: {
      overview: "/portal",
      financial: {
        invoices: "/portal/financial/invoices",
        reports: "/portal/financial/reports",
      },
    },
    admin: {
      overview: "/admin",
      clients: {
        root: "/portal/admin/clients",
        create: "/portal/admin/clients/create",
        edit: "/portal/admin/clients/edit",
        search: "/portal/admin/clients/search",
      },
      labels: {
        root: "/portal/admin/labels",
        create: "/portal/admin/labels/create",
        edit: "/portal/admin/labels/edit",
        search: "/portal/admin/labels/search",
      },
    },
  },
  protected: [
    { path: "/auth/login", roles: [Roles.All] },
    { path: "/admin", roles: [Roles.Admin] },
    { path: "/user", roles: [Roles.User, Roles.Admin] },
    { path: "/portal/financial/invoices", roles: [Roles.All] },
    { path: "/portal/financial/reports", roles: [Roles.All] },
  ] as ProtectedRouteConfig[],
};

export default routes;
