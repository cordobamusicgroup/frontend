import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { protectedRouteConfigs } from "./lib/routes/protectedRoutes";

/**
 * Middleware function that handles authentication and authorization for protected routes.
 * @param request - The NextRequest object representing the incoming request.
 * @returns A NextResponse object or calls the NextResponse.next() function to continue processing the request.
 */
export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const userRole = request.cookies.get("user_role")?.value;
  /*
  // Early return if the request is for the login page to avoid infinite redirects
  if (request.nextUrl.pathname === "/auth/login") {
    return NextResponse.next();
  }

  const matchedRoute = protectedRouteConfigs.find((route) => {
    const regex = new RegExp(`^${route.path}`);
    return regex.test(request.nextUrl.pathname);
  });

  if (matchedRoute) {
    // Check if the user has the required role for the matched route
    if (matchedRoute.roles !== "ALL" && (!userRole || !matchedRoute.roles.includes(userRole))) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  } else if (!token) {
    // Redirect to login if no token is present and the request is not for the login page
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }*/

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|static|_next|.*\\..*).*)"],
};
