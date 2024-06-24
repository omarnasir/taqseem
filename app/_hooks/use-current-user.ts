'use client'
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"


export function useCurrentUser() : Session["user"] {
  const router = useRouter();
  const { data: session } = useSession();

  if (session) {
    return session.user
  }
  router.push("/login");
}