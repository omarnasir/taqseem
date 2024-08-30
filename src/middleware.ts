import { NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import { authConfig } from "@/lib/auth"

const DEFAULT_REDIRECT = "/dashboard";
const PUBLIC_ROUTES = ["/login", "/register"];
const ROOT = "/";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const path = req.nextUrl.pathname;

  const isAuthRoute = PUBLIC_ROUTES.includes(path);
  const isRoot = path === ROOT;

  if (req.auth) {
    if (isAuthRoute || isRoot) {
      return NextResponse.redirect(new URL(DEFAULT_REDIRECT, req.nextUrl.origin));
    }
  }
  if (!req.auth && !isAuthRoute) {
    return NextResponse.redirect(new URL('/login', req.nextUrl.origin));
  }
});


export const config = {
  matcher: ["/((?!api|_next|static|_next/image|favicon.ico).*)"]
}