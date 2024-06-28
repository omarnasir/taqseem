'use client'
import { useQuery } from "@tanstack/react-query";
import { UserBasicData } from "@/types/users.type";


export function useGetGroupMemberships(groupId : string, membershipsInitialData?: UserBasicData[]) {
  const { data: memberships } = useQuery({
    queryKey: ['memberships', groupId],
    queryFn: async () => {
      const res = await fetch(`/api/groups/memberships?groupId=${groupId}`)
      const data = await res.json()
      return data as UserBasicData[]
    },
    initialData: membershipsInitialData,
  });
  return memberships;
}