'use client'
import { useQuery } from "@tanstack/react-query";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation"


export function useSessionHook(): { session: Session | null, status: 'loading' | 'authenticated' | 'unauthenticated' } {
  const router = useRouter();

  const queryResponse = useQuery({
    queryKey: ["session"],
    queryFn: () => getSession().then((session) => {
      if (session) {
        console.log('useSessionHook', session)
        return session
      }
      router.push("/login");
    })
  });
  return {
    session: queryResponse.data ?? null,
    status: queryResponse.status === 'pending' ?
      'loading' : queryResponse.data ? 'authenticated' : 'unauthenticated'
  }
}