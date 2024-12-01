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
      forgotPassword: "/auth/forgot-password",
      resetPassword: "/auth/reset-password",
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
      overview: "/",
      financial: {
        invoices: "/financial/invoices",
        reports: "/financial/reports",
      },
    },
    admin: {
      overview: "/admin",
      clients: {
        root: "/admin/clients",
        create: "/admin/clients/create",
        edit: "/admin/clients/edit",
        search: "/admin/clients/search",
      },
      labels: {
        root: "/admin/labels",
        create: "/admin/labels/create",
        edit: "/admin/labels/edit",
        search: "/admin/labels/search",
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
