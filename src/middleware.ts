import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token");

  // Redirige a la página de autenticación si no hay token y la ruta no es /auth
  if (!token && request.nextUrl.pathname !== "/auth") {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // Continúa con la siguiente respuesta si hay un token o si la ruta es /auth
  return NextResponse.next();
}

// Configuración del matcher para determinar las rutas que deben pasar por el middleware
export const config = {
  matcher: [
    "/((?!auth|static|_next/static|_next/image|favicon.ico|public/.*).*)", // Excluye rutas específicas y la carpeta public
  ],
};
