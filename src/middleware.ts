import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { protectedRouteConfigs } from "./lib/routes/protectedRoutes";
import webRoutes from "./lib/routes/webRoutes";

const encoder = new TextEncoder();
const JWT_SECRET = encoder.encode(process.env.JWT_SECRET || "your-secret-key");

const supportedLocales = ["en", "es"] as const;
type SupportedLocale = (typeof supportedLocales)[number];

function isSupportedLocale(locale: string): locale is SupportedLocale {
  return supportedLocales.includes(locale as SupportedLocale);
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const lastUrl = request.cookies.get("last_url")?.value || webRoutes.portal;
  const userLocale = request.cookies.get("user_locale")?.value;
  const preferredLocale = userLocale || request.headers.get("accept-language")?.split(",")[0].split("-")[0] || "en";

  const locale: SupportedLocale = isSupportedLocale(preferredLocale) ? preferredLocale : "en";

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);

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
    response.cookies.set("last_url", request.nextUrl.pathname);
  }
  response.cookies.set("user_locale", locale);

  return response;
}

export const config = {
  matcher: ["/((?!api|static|_next|.*\\..*).*)"],
};
