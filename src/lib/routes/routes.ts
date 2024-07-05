// routes.ts

export interface RouteConfig {
  path: string;
  roles: string[] | "ALL";
}

export const routeConfigs: RouteConfig[] = [
  { path: "/login", roles: "ALL" },
  { path: "/static", roles: "ALL" },
  { path: "/admin", roles: ["admin"] },
  { path: "/user", roles: ["user", "admin"] },
];
