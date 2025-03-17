import { Roles } from "@/constants/roles";
import { Edit } from "@mui/icons-material";
import { Link } from "@mui/material";

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
      refresh: "/auth/refresh",
      logout: "/auth/logout",
    },
    users: {
      editProfile: "/users/edit-profile",
      getCurrent: "/users/current",
      admin: {
        root: "/users/admin",
        register: "/users/admin/register",
        getAll: "/users/admin/all",
        viewAs: "/users/admin/view-as-client",
        getById: (id: number) => `/users/admin/${id}`,
        resendAccountInfo: "/users/admin/resend-account-info",
      },
    },
    clients: {
      root: "/clients",
    },
    labels: {
      root: "/labels",
    },
    financial: {
      balances: {
        root: "/financial/balances",
        transactions: "/financial/balances/transactions",
      },
      payments: {
        root: "/financial/payments",
        withdrawalAuthorized: "/financial/payments/withdrawal-authorized",
      },
      reports: {
        user: {
          currentReports: "/financial/reports/user-reports/current",
          downloadReport: "/financial/reports/user-reports/download",
        },
        admin: {
          unlinked: {
            get: "/financial/reports/admin/unlinked",
            linkMissing: "/financial/reports/admin/link-missing",
          },
        },
      },
    },

    countries: "/countries",
  },
  web: {
    login: "/auth/login",
    portal: {
      overview: "/",
      financial: {
        payments: "/financial/payments",
        reports: "/financial/reports",
      },
      user: {
        profile: "/user/profile",
      },
    },
    admin: {
      overview: "/admin",
      workflow: {
        root: "/admin/workflow",
      },
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
      users: {
        root: "/admin/users",
        create: "/admin/users/create",
        edit: "/admin/users/edit",
      },
      reports: {
        root: "/admin/reports",
        unlinked: {
          root: "/admin/reports/unlinked",
          create: "/admin/reports/unlinked/link-report",
        },
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
