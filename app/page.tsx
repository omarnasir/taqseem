import styles from './page.module.css'
import ClientExample from "@/components/client-example"

import { auth } from "@/auth"
import { SessionProvider } from "next-auth/react"


export default async function Home() {
  const session = await auth()
  if (session?.user) {
    // filter out sensitive data before passing to client.
    session.user = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email
    }
  }
  return (
      <SessionProvider session={session}>
          <ClientExample />
      </SessionProvider>
  )
}