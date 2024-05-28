'use server'
import { 
  GroupWithMembers,
  type GroupData, 
} from '@/app/_types/model/groups';
import { type Response } from '@/app/_types/response';
import { auth } from '@/auth';
import { getGroupsByUserId, getGroupById } from '@/app/_data/groups';
import { getUserAmountOwedByGroupService } from './transactions';

type GetAllGroupsResponse = Omit<Response, 'data'> & {
  data?: GroupData[];
}

type GetGroupResponse = Omit<Response, 'data'> & {
  data?: GroupWithMembers
}

type GroupDataWithAmountOwed = GroupData & {
  amountOwed: number
}

type GetAllGroupsWithAmountResponse = Omit<Response, 'data'> & {
  data?: GroupDataWithAmountOwed[]
}

async function getAllGroupsService(): Promise<GetAllGroupsResponse> {
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

async function getGroupDetailsService(groupId: string): Promise<GetGroupResponse> {
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


async function getUserAmountOwedForAllGroups(): Promise<GetAllGroupsWithAmountResponse> {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  try {
    const response = await getGroupsByUserId(session.user.id as string)
    let groupsWithAmountOwed: GroupDataWithAmountOwed[] = [];

    for (const group of response) {
      groupsWithAmountOwed.push({ ...group, amountOwed: 0 });
      const amountOwedResponse = await getUserAmountOwedByGroupService(group.id);
        if (!amountOwedResponse.success) {
          return { success: false, error: amountOwedResponse.error };
        }
        groupsWithAmountOwed.find(g => g.id === group.id)!.amountOwed = amountOwedResponse.data;
       }
    return { success: true, data: groupsWithAmountOwed };
  }
  catch (e) {
    return { success: false, error: e.message };
  }
}

export { 
  getAllGroupsService, 
  getGroupDetailsService,
  getUserAmountOwedForAllGroups,
  type GroupDataWithAmountOwed
};