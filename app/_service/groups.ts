'use server'
import { auth } from '@/auth';

import { 
  GroupWithMembers,
  type GroupData, 
} from '@/app/_types/model/groups';
import { type Response } from '@/app/_types/response';

import { getGroupsByUserId, getGroupById } from '@/app/_data/groups';
import { 
  getMembersBalancesByUserGroups,
  type MemberBalanceByGroups
 } from '@/app/_data/transactions';

type GetAllGroupsResponse = Omit<Response, 'data'> & {
  data?: GroupData[];
}

type GetGroupResponse = Omit<Response, 'data'> & {
  data?: GroupWithMembers
}

type GETGroupBalancesByUserResponse = Omit<Response, "data"> & {
  data?: MemberBalanceByGroups
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

async function getMembersBalancesByUserGroupsService(): Promise<GETGroupBalancesByUserResponse> {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  try {
    const response = await getMembersBalancesByUserGroups(session?.user?.id as string);

    return { success: true, data: response };
  }
  catch (e) {
    return { success: false, error: e.message };
  }
}

export { 
  getAllGroupsService, 
  getGroupDetailsService,
  getMembersBalancesByUserGroupsService,
  type MemberBalanceByGroups
};