import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/app/prisma"
import type { NextAuthConfig } from "next-auth"

import CredentialsProvider from "next-auth/providers/credentials"

export const config = {
    adapter: PrismaAdapter(prisma),
    secret: process.env.AUTH_SECRET,
    providers: [CredentialsProvider({
        id: 'credentials',
        name: 'Credentials',
        credentials: {
            username: { label: 'username', type: 'username' },
            email: { label: 'Email', type: 'email' },
            password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials, req) {
          // Add logic here to look up the user from the credentials supplied
          const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }
    
          if (user) {
            // Any object returned will be saved in `user` property of the JWT
            return user
          } else {
            // If you return null then an error will be displayed advising the user to check their details.
            return null
          }
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