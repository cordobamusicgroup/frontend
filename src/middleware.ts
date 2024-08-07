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

  let response = NextResponse.next();

  // Set isAuthenticated cookie
  console.log("Setting isAuthenticated cookie");
  response.cookies.set("isAuthenticated", isAuthenticated.toString(), {
    path: "/",
    sameSite: "strict",
    secure: true,
    httpOnly: false,
  });

  // Set last_url cookie
  const currentUrl = request.nextUrl.pathname + request.nextUrl.search;
  console.log("Setting last_url cookie");
  response.cookies.set("last_url", currentUrl, {
    path: "/",
    sameSite: "strict",
    secure: true,
    httpOnly: false,
  });

  // Redirect to ensure cookies are set
  console.log("Redirecting to ensure cookies are set");
  response = NextResponse.redirect(request.nextUrl.clone());

  return response;
}

export const config = {
  matcher: ["/((?!api|static|_next|.*\\..*).*)"],
};
