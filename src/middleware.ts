import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { protectedRouteConfigs } from "./lib/routes/protectedRoutes";
import webRoutes from "./lib/routes/webRoutes";

const encoder = new TextEncoder();
const JWT_SECRET = encoder.encode(process.env.JWT_SECRET);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const lastUrl = request.cookies.get("last_url")?.value || webRoutes.portal;
  let isAuthenticated = false;

  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      isAuthenticated = true;

      if (request.nextUrl.pathname === webRoutes.login || request.nextUrl.pathname === "/") {
        return NextResponse.redirect(new URL(lastUrl, request.url));
      }
    } catch (error) {
      console.log(error);
      return NextResponse.redirect(new URL(webRoutes.login, request.url));
    }
  } else {
    if (request.nextUrl.pathname !== webRoutes.login) {
      return NextResponse.redirect(new URL(webRoutes.login, request.url));
    }
  }

  const matchedRoute = protectedRouteConfigs.find((route) => {
    const regex = new RegExp(`^${route.path}`);
    return regex.test(request.nextUrl.pathname);
  });

  if (matchedRoute) {
    const userRole = JSON.parse(request.cookies.get("user_role")?.value || "null");
    if (matchedRoute.roles !== "ALL" && (!userRole || !matchedRoute.roles.includes(userRole))) {
      return NextResponse.redirect(new URL(webRoutes.login, request.url));
    }
  }

  const response = NextResponse.next();

  if (request.nextUrl.pathname !== webRoutes.login) {
    response.cookies.set("last_url", request.nextUrl.pathname, { path: "/" });
  }
  response.cookies.set("isAuthenticated", isAuthenticated.toString(), { path: "/" });

  return response;
}

export const config = {
  matcher: ["/((?!api|static|_next|.*\\..*).*)"],
};
