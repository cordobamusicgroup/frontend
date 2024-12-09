import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import routes from "./lib/routes/routes";
import { Roles } from "@/constants/roles"; // Enum de Roles

const encoder = new TextEncoder();
const JWT_SECRET = encoder.encode(process.env.JWT_SECRET);

// Expresión regular para rutas públicas dentro de /auth/*
const publicAuthRegex = /^\/auth\/.*/;

export async function middleware(request: NextRequest) {
  const { web, protected: protectedRoutes } = routes;
  const token = request.cookies.get("access_token")?.value;
  const lastUrl = request.cookies.get("last_url")?.value || web.portal.overview;
  const currentPath = request.nextUrl.pathname;

  let isAuthenticated = false;
  let userRole: Roles | null = null; // Definimos explícitamente que el rol es de tipo `Roles` o `null`

  // Verificar si la ruta es pública (cualquier ruta que comience con /auth/)
  const isPublicRoute = publicAuthRegex.test(currentPath);

  // Si es una ruta pública, permitir el acceso sin autenticación
  if (isPublicRoute) {
    console.log(`Ruta pública detectada: ${currentPath}, acceso permitido.`);
    return NextResponse.next();
  }

  // Verificar token JWT
  if (token) {
    try {
      // Verificar el token y extraer el rol del payload
      const { payload } = await jwtVerify(token, JWT_SECRET);
      isAuthenticated = true;
      userRole = payload.role as Roles; // Casteamos el rol al tipo `Roles`
      console.log(`Token válido, rol detectado: ${userRole}, ruta actual: ${currentPath}`);
    } catch (error) {
      console.log("Token verification failed:", error);
    }
  } else {
    console.log(`No se encontró token, ruta actual: ${currentPath}`);
  }

  // Redirigir al login si no está autenticado y no está en una ruta pública
  if (!isAuthenticated && currentPath !== web.login) {
    console.log(`Usuario no autenticado, redirigiendo al login desde: ${currentPath}`);
    return NextResponse.redirect(new URL(web.login, request.url));
  }

  // Redirigir al último URL si está autenticado y está en la página de login
  if (isAuthenticated && currentPath === web.login) {
    const redirectUrl = lastUrl || web.portal.overview;
    console.log(`Usuario autenticado, redirigiendo a la última URL visitada: ${redirectUrl}`);
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Comprobar si la ruta es protegida y si el rol de usuario tiene acceso
  const matchedRoute = protectedRoutes.find((route) => {
    const regex = new RegExp(`^${route.path}`);
    return regex.test(currentPath);
  });

  // Si la ruta está protegida, comprobar el rol del usuario
  if (matchedRoute) {
    if (matchedRoute.roles === Roles.All) {
      if (!isAuthenticated) {
        console.log(`Ruta protegida para todos los roles, pero no autenticado: ${currentPath}`);
        return NextResponse.redirect(new URL(web.portal.overview, request.url));
      } else {
        console.log(`Acceso permitido para todos los roles en la ruta: ${currentPath}`);
      }
    } else if (!userRole || !matchedRoute.roles.includes(userRole)) {
      console.log(`Acceso denegado. Rol detectado: ${userRole}, Ruta: ${currentPath}`);
      return NextResponse.redirect(new URL(web.portal.overview, request.url));
    } else {
      console.log(`Acceso permitido. Rol detectado: ${userRole}, Ruta: ${currentPath}`);
    }
  }

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
