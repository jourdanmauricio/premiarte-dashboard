import { authMiddleware } from "@/auth";

// Next.js 16: proxy reemplaza a middleware. Protege rutas y redirige al login si no hay sesión.
export const proxy = authMiddleware;

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
