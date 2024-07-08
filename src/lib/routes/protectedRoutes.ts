// routes.ts

export interface ProtectedRouteConfig {
  path: string;
  roles: string[] | "ALL";
}

export const protectedRouteConfigs: ProtectedRouteConfig[] = [
  { path: "/login", roles: "ALL" },
  { path: "/admin", roles: ["admin"] },
  { path: "/user", roles: ["user", "admin"] },
  { path: "/public", roles: "ALL" },
];
