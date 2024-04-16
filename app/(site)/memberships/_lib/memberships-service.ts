'use server'
import { type Response } from '@/app/_types/response';
import { auth } from '@/auth';
import { UserBasicData } from '@/app/_types/model/users';
import { getMembershipsByGroupId } from '@/app/_data/memberships';

type GetAllMembershipsesponseType = Omit<Response, 'data'> & {
  data?: UserBasicData[];
}

async function getMembershipsByGroupIdService(groupId: string): Promise<GetAllMembershipsesponseType> {
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