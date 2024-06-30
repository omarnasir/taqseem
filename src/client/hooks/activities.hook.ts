'use client'
import { useInfiniteQuery } from "@tanstack/react-query";
import { type ActivityService } from "@/types/activities.type";


export function useGetUserActivity(userId: string, groupIds: string[], activitiesInitialData: ActivityService) {
  const query = useInfiniteQuery({
    queryKey: ['activities', userId],
    queryFn: async ({ pageParam }) => {
      const res = await fetch(`/api/groups/activities?groupIds=${groupIds.join(',')}${pageParam ? `&cursor=${pageParam}` : ''}`);
      const data = await res.json();
      return data as ActivityService;
    },
    initialPageParam: activitiesInitialData.cursor,
    initialData: { pages: [activitiesInitialData], pageParams: [activitiesInitialData.cursor] },
    getNextPageParam: (lastPage) => lastPage?.cursor,
  });

  return query;
}