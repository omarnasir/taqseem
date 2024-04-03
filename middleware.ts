import NextAuth from 'next-auth';
import { authConfig } from "@/auth"

const DEFAULT_REDIRECT = "/dashboard";
const AUTH_ROUTES = ["/login", "/register"];
const ROOT = "/";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;

  const isAuthenticated = !!req.auth;
  const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname);
  const isRoot = nextUrl.pathname === ROOT;

  if (isAuthenticated) {
    if (isAuthRoute || isRoot) {
      return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl));
    }
  }
  if (!isAuthenticated && !isAuthRoute) {
    return Response.redirect(new URL('/login', nextUrl));
  }
});


export const config = {
  matcher: ["/((?!api|_next|static|_next/image|favicon.ico).*)"]
}