"use server";
import { getActivitiesByGroupIds } from '@/server/data/activities.data';
import { type ActivityService } from '@/types/activities.type';
import { ServiceResponse } from '@/types/service-response.type';
import { auth } from '@/lib/auth';


type GETActivitiesResponseType = ServiceResponse<ActivityService>

/**
 * Get activities by group IDs.
 * 
 * If the data layer throws an exception, return failure with the error message.
 * @param groupIds 
 * @param cursor 
 * @returns 
 */
async function getActivityService({ groupIds, cursor }: { groupIds: string[], cursor?: number }): Promise<GETActivitiesResponseType> {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  try {
    const response = await getActivitiesByGroupIds({groupIds, userId: session?.user?.id as string, cursor});

    return { success: true, data: response };
  }
  catch (e) {
    return { success: false, error: e.message };
  }
}

export {
  getActivityService,
}