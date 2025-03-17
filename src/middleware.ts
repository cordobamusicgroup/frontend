import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import routes from "./lib/routes/routes";
import { Roles } from "@/constants/roles"; // Enum de Roles

const encoder = new TextEncoder();
const JWT_SECRET = encoder.encode(process.env.JWT_SECRET);

// Expresión regular para rutas públicas dentro de /auth/*
const publicAuthRegex = /^\/auth\/.*/;
// Add API URLs to the public routes list
const publicApiRoutes = ["/api/auth/login", "/api/auth/refresh", "/api/auth/forgot-password", "/api/auth/reset-password"];

export async function middleware(request: NextRequest) {
  const { web, protected: protectedRoutes } = routes;
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const lastUrl = request.cookies.get("last_url")?.value || web.portal.overview;
  const currentPath = request.nextUrl.pathname;

  let isAuthenticated = false;
  let userRole: Roles | null = null;

  // Verify if the route is public
  const isPublicRoute = publicAuthRegex.test(currentPath) || publicApiRoutes.includes(currentPath);

  // If it's a public route, allow access without authentication
  if (isPublicRoute) {
    console.log(`Public route detected: ${currentPath}, access allowed.`);
    return NextResponse.next();
  }

  // Verify JWT token
  if (accessToken) {
    try {
      const { payload } = await jwtVerify(accessToken, JWT_SECRET);
      isAuthenticated = true;
      userRole = payload.role as Roles;
      console.log(`Valid token, detected role: ${userRole}, current route: ${currentPath}`);
    } catch (error) {
      console.log("Token verification failed:", error);

      // If there's a refresh token available, redirect to login so the client can refresh the token
      if (refreshToken) {
        console.log("Refresh token available, redirecting to login for fresh authentication");
      } else {
        console.log("No refresh token available, authentication required");
      }
    }
  } else {
    console.log(`No token found, current route: ${currentPath}`);
  }

  // Redirect to login if not authenticated and not on the login page
  if (!isAuthenticated && currentPath !== web.login) {
    console.log(`User not authenticated, redirecting to login from: ${currentPath}`);
    return NextResponse.redirect(new URL(web.login, request.url));
  }

  // Redirect to last URL if authenticated and on the login page
  if (isAuthenticated && currentPath === web.login) {
    const redirectUrl = lastUrl || web.portal.overview;
    console.log(`User authenticated, redirecting to last visited URL: ${redirectUrl}`);
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Check if the route is protected and if the user role has access
  const matchedRoute = protectedRoutes.find((route) => {
    const regex = new RegExp(`^${route.path}`);
    return regex.test(currentPath);
  });

  // If the route is protected, check the user's role
  if (matchedRoute) {
    if (matchedRoute.roles === Roles.All) {
      if (!isAuthenticated) {
        console.log(`Protected route for all roles, but not authenticated: ${currentPath}`);
        return NextResponse.redirect(new URL(web.portal.overview, request.url));
      } else {
        console.log(`Access allowed for all roles on route: ${currentPath}`);
      }
    } else if (!userRole || !matchedRoute.roles.includes(userRole)) {
      console.log(`Access denied. Detected role: ${userRole}, Route: ${currentPath}`);
      return NextResponse.redirect(new URL(web.portal.overview, request.url));
    } else {
      console.log(`Access allowed. Detected role: ${userRole}, Route: ${currentPath}`);
    }
  }

  // Create response
  const response = NextResponse.next();

  // Configure `last_url` if not on login page
  if (currentPath !== web.login && lastUrl !== currentPath) {
    response.cookies.set("last_url", currentPath, {
      path: "/",
      sameSite: "strict",
      secure: true,
      httpOnly: false,
    });
  }

  // Set `isAuthenticated` in cookies
  response.cookies.set("isAuthenticated", isAuthenticated.toString(), {
    path: "/",
    sameSite: "strict",
    secure: true,
    httpOnly: false,
  });

  return response;
}

export const config = {
  matcher: ["/((?!api|static|_next|.*\\..*).*)"],
};
