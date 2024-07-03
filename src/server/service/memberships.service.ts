'use server'
import { type ServiceResponse } from '@/types/service-response.type';
import { auth } from '@/lib/auth';
import { UserBasicData } from '@/types/users.type';
import { getMembershipsByGroupAndUserId } from '@/server/data/memberships.data';


type GetAllMembershipsResponseType = ServiceResponse<UserBasicData[]>;

/**
 * Get all memberships by group id.
 * 
 * The session userId is used to fetch their memberships.
 * @param groupId 
 * @returns
 * If userId is not part of the requested group, return failure with an error message.
 */
async function getMembershipsByGroupIdService(groupId: string): Promise<GetAllMembershipsResponseType> {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  try {
    const response = await getMembershipsByGroupAndUserId({groupId, userId: session.user.id as string});

    return { success: true, data: response };
  }
  catch (e) {
    return { success: false, error: e.message };
  }
}

export { getMembershipsByGroupIdService };