import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      name: string,
      /** The user's email address. */
      email: string,
      /** The user's id. */
      id: string,
    } & DefaultSession["user"]
  }
}