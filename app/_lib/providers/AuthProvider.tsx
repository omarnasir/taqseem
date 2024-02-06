"use client";

import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'

export type AuthContextProps = {
  children: React.ReactNode
  session: Session
}

export default function Provider({ children }: AuthContextProps) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}