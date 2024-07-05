import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routeConfigs } from "./lib/routes/routes";

/**
 * Middleware function to handle authentication and authorization.
 * @param request - The NextRequest object representing the incoming request.
 * @returns A NextResponse object representing the response to be sent.
 */
export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const userRole = request.cookies.get("user_role")?.value;

  const matchedRoute = routeConfigs.find((route) => new RegExp(`^${route.path}`).test(request.nextUrl.pathname));

  if (matchedRoute) {
    if (matchedRoute.roles !== "ALL" && (!userRole || !matchedRoute.roles.includes(userRole))) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } else if (!token && request.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: routeConfigs.map((route) => route.path),
};
