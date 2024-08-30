const webRoutes = {
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
    clients: "/portal/admin/clients",
    createClient: "/portal/admin/clients/create",
  },
};

export default webRoutes;
