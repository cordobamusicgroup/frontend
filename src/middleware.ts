import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import routes from "./lib/routes/routes";

const encoder = new TextEncoder();
const JWT_SECRET = encoder.encode(process.env.JWT_SECRET);

export async function middleware(request: NextRequest) {
  const { web, protected: protectedRoutes } = routes;
  const token = request.cookies.get("access_token")?.value;
  const lastUrl = request.cookies.get("last_url")?.value || web.portal.overview;
  const currentPath = request.nextUrl.pathname;

  let isAuthenticated = false;

  // Verificar token JWT
  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      isAuthenticated = true;
    } catch (error) {
      console.log("Token verification failed:", error);
    }
  }

  // Redirigir al login si no está autenticado y no está en la página de login
  if (!isAuthenticated && currentPath !== web.login) {
    return NextResponse.redirect(new URL(web.login, request.url));
  }

  // Redirigir al último URL si está autenticado y está en la página de login o raíz
  if (isAuthenticated && (currentPath === web.login || currentPath === "/")) {
    const redirectUrl = lastUrl !== "/" ? lastUrl : web.portal.overview;
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Comprobar si la ruta es protegida y si el rol de usuario tiene acceso
  const matchedRoute = protectedRoutes.find((route) => {
    const regex = new RegExp(`^${route.path}`);
    return regex.test(currentPath);
  });

  // TODO: Requiere implementar detección de roles de usuarios para rutas protegidas por roles

  /* if (matchedRoute) {
    const userRole = JSON.parse(request.cookies.get("user_role")?.value || "null");
    if (matchedRoute.roles !== "ALL" && (!userRole || !matchedRoute.roles.includes(userRole))) {
      return NextResponse.redirect(new URL(web.portal.overview, request.url));
    }
  } */

  // Crear la respuesta
  const response = NextResponse.next();

  // Configurar `last_url` si no está en la página de login
  if (currentPath !== web.login && lastUrl !== currentPath) {
    response.cookies.set("last_url", currentPath, {
      path: "/",
      sameSite: "strict",
      secure: true,
      httpOnly: false,
    });
  }

  // Configurar `isAuthenticated` en las cookies
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
