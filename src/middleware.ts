import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { protectedRouteConfigs } from "./lib/routes/protectedRoutes";
import webRoutes from "./lib/routes/webRoutes";

const encoder = new TextEncoder();
const JWT_SECRET = encoder.encode(process.env.JWT_SECRET);

export default async function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const lastUrl = request.cookies.get("last_url")?.value || webRoutes.portal;
  let isAuthenticated = false;

  console.log("Incoming request URL:", request.url);
  console.log("Token found:", !!token);
  console.log("Last URL cookie:", lastUrl);

  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      isAuthenticated = true;
      console.log("Token is valid, user is authenticated.");
    } catch (error) {
      console.log("JWT verification error:", error);
    }
  }

  console.log("Is Authenticated after JWT check:", isAuthenticated);

  // Check if we need to set the isAuthenticated cookie
  if (!request.cookies.get("isAuthenticated")) {
    console.log("Setting isAuthenticated cookie");
    const response = NextResponse.redirect(request.nextUrl.clone());
    response.cookies.set("isAuthenticated", isAuthenticated.toString(), {
      path: "/",
      sameSite: "strict",
      secure: true,
      httpOnly: false, // Set to false to be accessible from client-side scripts
    });
    return response;
  }

  // Check if we need to set the last_url cookie
  if (request.nextUrl.pathname !== webRoutes.login && !request.cookies.get("last_url")) {
    console.log("Setting last_url cookie");
    const response = NextResponse.redirect(request.nextUrl.clone());
    response.cookies.set("last_url", request.nextUrl.pathname, {
      path: "/",
      sameSite: "strict",
      secure: true,
      httpOnly: false,
    });
    return response;
  }

  // Redirige al login si no está autenticado y no está en la página de login
  if (!isAuthenticated && request.nextUrl.pathname !== webRoutes.login) {
    console.log("User is not authenticated. Redirecting to login.");
    return NextResponse.redirect(new URL(webRoutes.login, request.url));
  }

  // Redirige al portal si está autenticado y está en la página de login o en la raíz
  if (isAuthenticated && (request.nextUrl.pathname === webRoutes.login || request.nextUrl.pathname === "/")) {
    console.log("User is authenticated and on login or root page. Redirecting to portal.");
    return NextResponse.redirect(new URL(webRoutes.portal, request.url));
  }

  const matchedRoute = protectedRouteConfigs.find((route) => {
    const regex = new RegExp(`^${route.path}`);
    return regex.test(request.nextUrl.pathname);
  });

  if (matchedRoute) {
    const userRole = JSON.parse(request.cookies.get("user_role")?.value || "null");
    if (matchedRoute.roles !== "ALL" && (!userRole || !matchedRoute.roles.includes(userRole))) {
      console.log("User does not have the required role. Redirecting to login.");
      return NextResponse.redirect(new URL(webRoutes.login, request.url));
    }
  }

  const response = NextResponse.next();

  return response;
}

export const config = {
  matcher: ["/((?!api|static|_next|.*\\..*).*)"],
};
