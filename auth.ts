// auth.ts (en la raíz del proyecto)
import axios from "axios";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { NextResponse } from "next/server";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
  interface User {
    accessToken?: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    accessToken?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("=== AUTHORIZE LLAMADO ===");
        console.log("Credentials:", credentials);

        const { email, password } = credentials || {};

        if (!email || !password) {
          console.log("Faltan credenciales");

          throw new Error("Email y contraseña son requeridos");
        }

        try {
          console.log("Llamando a:", `${process.env.API_URL}/auth/login`);

          const { data } = await axios.post(
            `${process.env.API_URL}/auth/login`,
            { email, password },
          );
          console.log("Respuesta API:", data);

          if (!data?.user) {
            return null;
          }

          return {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            accessToken: data.access_token,
          };
        } catch (error) {
          console.error("Error en login:", error);

          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // En el login inicial, user contiene los datos de authorize()
      if (user?.accessToken) {
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      // Exponemos el accessToken en la sesión del cliente
      session.accessToken = token.accessToken;
      return session;
    },
  },
});

// Middleware de autenticación: protege /dashboard y redirige al login
export const authMiddleware = auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Si NO está logueado y trata de acceder a /dashboard → redirigir a /
  if (!isLoggedIn && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  // Si está logueado y está en / → redirigir a /dashboard
  if (isLoggedIn && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
});
