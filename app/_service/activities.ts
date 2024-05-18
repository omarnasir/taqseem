"use server";
import { getActivitiesByUserId, type ActivitiesByUserId } from '@/app/_data/activities';
import { Response } from '@/app/_types/response';
import { auth } from '@/auth';


type GETActivitiesResponseType = Omit<Response, "data"> & {
  data?: ActivitiesByUserId[]
}

async function getActivityService(): Promise<GETActivitiesResponseType> {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  try {
    const response = await getActivitiesByUserId(session?.user?.id as string);

    return { success: true, data: response };
  }
  catch (e) {
    return { success: false, error: e.message };
  }
}

export {
  getActivityService,
}