'use server'
import { type ServiceResponse } from '@/types/service-response.type';
import { auth } from '@/lib/auth';
import { UserBasicData } from '@/types/users.type';
import { getMembershipsByGroupId } from '@/server/data/memberships.data';

type GetAllMembershipsResponseType = Omit<ServiceResponse, 'data'> & {
  data?: UserBasicData[];
}

async function getMembershipsByGroupIdService(groupId: string): Promise<GetAllMembershipsResponseType> {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  try {
    const response = await getMembershipsByGroupId(groupId, session.user.id as string);

    return { success: true, data: response };
  }
  catch (e) {
    return { success: false, error: e.message };
  }
}

export { getMembershipsByGroupIdService };