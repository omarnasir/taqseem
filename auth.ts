import NextAuth from "next-auth"
import type { NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/app/prisma"

import {
  hashPassword,
  verifyPassword
} from "@/app/utils/hashing"

export const config = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days  
  },
  pages: {
    signIn: "/",
  },
  secret: process.env.AUTH_SECRET,
  providers: [CredentialsProvider({
    id: 'credentials',
    name: 'Credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials: any, req: any) {

      // Add logic here to look up the user from the credentials supplied
      if (credentials.email === "" || credentials.password === "") {
        return null
      }
      // First check if the user exists
      const user = await prisma.user.findUnique({
        where: {
          email: credentials.email,
        },
      })
      if (!user) {
        return null
      }

      // If user exists, check if password matches
      if (user && await verifyPassword(credentials.password, user.hashedPassword)) {
          // If password matches, return user
          const { hashedPassword, ...rest } = user
          console.log({rest})
        return rest
      } else {
        // If password doesn't match, return null
        return null
      }
    }
  })
  ],
} satisfies NextAuthConfig


export const { handlers, auth, signIn, signOut } = NextAuth(config)