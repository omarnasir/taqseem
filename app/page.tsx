import { auth } from "@/auth"
import { SessionProvider, signIn, signOut } from "next-auth/react"


export default async function Home() {
  const session = await auth()

  return (
    <SessionProvider session={session}>
      <main>
        {!session && (
          <>
            <h1> Sign in to continue</h1>
            <button onClick={signIn}>Sign In</button>
          </>
        )}
        {session && (
          <>
            <h1>Successfully signed in as {session.user.email}</h1>
            <button onClick={signOut}>sign out</button>
          </>
        )}
      </main>
    </SessionProvider>
  )
}