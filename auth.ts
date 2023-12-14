import NextAuth from "next-auth"
import NextAuthOptions from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/app/prisma"

import { verifyPassword } from "@/app/utils/hashing"

// const config = {
export const auth = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days  
  },
  pages: {
    signIn: "/",
  },
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
  providers: [CredentialsProvider({
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
    async signIn({ user, account, profile, email, credentials }) {
      return true
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`
      return baseUrl
    }
  }
  //   authorized({ request, auth }) {
  //     const { pathname } = request.nextUrl
  //     if (pathname === "/middleware-example") return !!auth
  //     return true
  //   },
  // },
} )// satisfies NextAuthConfig


// export const { handlers, auth, signIn, signOut } = NextAuth(config)