import NextAuth from "next-auth"
import type { NextAuthConfig } from "next-auth"

import CredentialsProvider from "next-auth/providers/credentials"

export const config = {
    theme: {
      logo: "https://next-auth.js.org/img/logo/logo-sm.png",
    },
    providers: [CredentialsProvider({
        name: 'Credentials',
        credentials: {
            username: { label: 'username', type: 'username' },
            password: { label: 'Password', type: 'password' },
        }
    })
    ],
    callbacks: {
        authorized({ request, auth }) {
          const { pathname } = request.nextUrl
          if (pathname === "/middleware-example") return !!auth
          return true
        },
      },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)