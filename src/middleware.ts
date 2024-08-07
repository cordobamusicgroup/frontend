import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { protectedRouteConfigs } from "./lib/routes/protectedRoutes";
import webRoutes from "./lib/routes/webRoutes";

const encoder = new TextEncoder();
const JWT_SECRET = encoder.encode(process.env.JWT_SECRET);

export default async function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  let isAuthenticated = false;

  console.log("Incoming request URL:", request.url);
  console.log("Token found:", !!token);

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

  const isAuthenticatedCookie = request.cookies.get("isAuthenticated");
  const lastUrlCookie = request.cookies.get("last_url");
  const currentUrl = request.nextUrl.pathname + request.nextUrl.search;
  let response;

  if (!isAuthenticatedCookie || isAuthenticatedCookie.value !== isAuthenticated.toString()) {
    console.log("Setting isAuthenticated cookie");
    response = NextResponse.next();
    response.cookies.set("isAuthenticated", isAuthenticated.toString(), {
      path: "/",
      sameSite: "strict",
      secure: true,
      httpOnly: false,
    });
    response = NextResponse.redirect(request.nextUrl.clone());
    return response;
  }

  if (!lastUrlCookie || lastUrlCookie.value !== currentUrl) {
    console.log("Setting last_url cookie");
    response = NextResponse.next();
    response.cookies.set("last_url", currentUrl, {
      path: "/",
      sameSite: "strict",
      secure: true,
      httpOnly: false,
    });
    response = NextResponse.redirect(request.nextUrl.clone());
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

  response = NextResponse.next();
  return response;
}

export const config = {
  matcher: ["/((?!api|static|_next|.*\\..*).*)"],
};
