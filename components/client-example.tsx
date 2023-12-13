"use client"

import { useSession } from "next-auth/react"
import { useState } from "react"
import SessionData from "./session-data"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { signIn, signOut } from "next-auth/react"

const UpdateForm = () => {
  const { data: session, update } = useSession()

  const [name, setName] = useState(session?.user?.name ?? "")

  if (!session?.user) {
    return (
      <form
        onSubmit={async () => {
          await signIn()
        }}
        className="flex items-center w-full max-w-sm space-x-2"
      >
        <Button type="submit">Sign In</Button>
      </form>
    )
  }
  return (
    <>
      <h2 className="text-xl font-bold">Updating the session</h2>
      <form
        onSubmit={async () => {
          if (session) {
            const newSession = await update({
              ...session,
              user: { ...session.user, name },
            })
            console.log({ newSession })
          }
        }}
        className="flex items-center w-full max-w-sm space-x-2"
      >
        <Input
          type="text"
          placeholder={session.user.name ?? ""}
          value={name}
          onChange={(e) => {
            setName(e.target.value)
          }}
        />
        <Button type="submit">Update</Button>
      </form>
    </>
  )
}

export default function ClientExample() {
  const { data: session, status } = useSession()

  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold">Client Side Rendering Usage</h1>

      {status === "loading" ? (
        <div>Loading...</div>
      ) : (
        <SessionData session={session} />
      )}
      <UpdateForm />
    </div>
  )
}
