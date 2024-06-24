"use server";
import { getActivitiesByGroupIds } from '@/app/_data/activities';
import { type ActivityWithDetails } from '@/app/_types/activities';
import { Response } from '@/app/_types/response';
import { auth } from '@/auth';


type GETActivitiesResponseType = Omit<Response, "data"> & {
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