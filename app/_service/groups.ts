'use server'
import { 
  GroupWithMembers,
  type GroupData, 
} from '@/app/_types/model/groups';
import { type Response } from '@/app/_types/response';
import { auth } from '@/auth';
import { getGroupsByUserId, getGroupById } from '@/app/_data/groups';

type GetAllGroupsResponseType = Omit<Response, 'data'> & {
  data?: GroupData[];
}

type GetGroupResponseType = Omit<Response, 'data'> & {
  data?: GroupWithMembers
}

async function getAllGroupsService(): Promise<GetAllGroupsResponseType> {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  try {
    const response = await getGroupsByUserId(session.user.id as string)
    return { success: true, data: response };
  }
  catch (e) {
    return { success: false, error: e.message };
  }
}

async function getGroupDetailsService(groupId: string): Promise<GetGroupResponseType> {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  try {
    const response = await getGroupById(groupId, session.user.id as string);

    return { success: true, data: response };
  }
  catch (e) {
    return { success: false, error: e.message };
  }
}

export { 
  getAllGroupsService, 
  getGroupDetailsService 
};