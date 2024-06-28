"use server";
import { getActivitiesByGroupIds } from '@/server/data/activities.data';
import { type ActivityWithDetails } from '@/types/activities.type';
import { ServiceResponse } from '@/types/service-response.type';
import { auth } from '@/lib/auth';


type GETActivitiesResponseType = Omit<ServiceResponse, "data"> & {
  data?: {
    activities: ActivityWithDetails[]
    cursor: number | undefined
  }
}

async function getActivityService(groupIds: string[], cursor: number | undefined): Promise<GETActivitiesResponseType> {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  try {
    const response = await getActivitiesByGroupIds(groupIds, session?.user?.id as string, cursor);

    return { success: true, data: response };
  }
  catch (e) {
    return { success: false, error: e.message };
  }
}

export {
  getActivityService,
}