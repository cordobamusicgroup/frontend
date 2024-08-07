import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { protectedRouteConfigs } from "./lib/routes/protectedRoutes";
import webRoutes from "./lib/routes/webRoutes";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

const encoder = new TextEncoder();
const JWT_SECRET = encoder.encode(process.env.JWT_SECRET);

const setCookie = (request: NextRequest, response: NextResponse, cookie: ResponseCookie) => {
  request.cookies.set(cookie);
  response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
  response.cookies.set(cookie);
  return response;
};

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

  let response = NextResponse.next();

  // Set isAuthenticated cookie if not present
  if (!request.cookies.get("isAuthenticated")) {
    console.log("Setting isAuthenticated cookie");
    response = setCookie(request, response, {
      name: "isAuthenticated",
      value: isAuthenticated.toString(),
      path: "/",
      sameSite: "strict",
      secure: true,
      httpOnly: false,
    });
    return response;
  }

  // Set last_url cookie if not present
  const currentUrl = request.nextUrl.pathname + request.nextUrl.search;
  const lastUrl = request.cookies.get("last_url")?.value;
  if (!lastUrl && currentUrl !== request.nextUrl.pathname) {
    console.log("Setting last_url cookie");
    response = setCookie(request, response, {
      name: "last_url",
      value: currentUrl,
      path: "/",
      sameSite: "lax",
      secure: true,
      httpOnly: false,
    });
    return response;
  }

  // Redirect to login if not authenticated and not on login page
  if (!isAuthenticated && request.nextUrl.pathname !== webRoutes.login) {
    console.log("User is not authenticated. Redirecting to login.");
    return NextResponse.redirect(new URL(webRoutes.login, request.url));
  }

  // Redirect to portal if authenticated and on login or root page
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

  return response;
}

export const config = {
  matcher: ["/((?!api|static|_next|.*\\..*).*)"],
};
