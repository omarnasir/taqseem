'use client'
import { useQuery } from "@tanstack/react-query";
import { GroupData } from "@/types/groups.type";


export function useGetUserGroups(sessionUserId: string, groupsInitialData?: GroupData[]) {
  const { data: groups } = useQuery({
    queryKey: ['groups', sessionUserId],
    queryFn: async () => {
      const res = await fetch(`/api/groups`)
      const data = await res.json()
      return data as GroupData[]
    },
    initialData: groupsInitialData
  });
  return groups;
}