import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/app/prisma"

import { verifyPassword } from "@/app/utils/hashing"


export const auth = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days  
  },
  pages: {
    signIn: "/login",
  },
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: {},
        password: {}
      },
      async authorize(credentials: any, req: any) {
        try {
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
          if (user && await verifyPassword(credentials.password, user.hashedPassword)) {
            // If password matches, return user
            const { hashedPassword, ...rest } = user
            return rest
          } else {
            // If password doesn't match, return null
            return null
          }
        }
        catch (e) {
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add access_token to the token right after signin
      if (user) { token.id = user.id }
      return token
    },
    async session({ session, token }) {
      // Add property to session, like an access_token from a provider.
      if (session.user) { session.user.id = token.id }
      return session
    }
  }
})
