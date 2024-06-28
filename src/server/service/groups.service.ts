'use server'
import { auth } from '@/lib/auth';

import { 
  GroupWithMembers,
  type GroupData, 
} from '@/types/groups.type';
import { type ServiceResponse } from '@/types/service-response.type';

import { getGroupsByUserId, getGroupById } from '@/server/data/groups.data';
import { 
  getGroupBalanceDetails,
  getBalancesByUserGroups
 } from '@/server/data/transactions.data';

import { type GroupBalanceDetails } from '@/types/groups.type';
import { type BalancesByUserGroups } from '@/types/users.type';

type GetAllGroupsResponse = Omit<ServiceResponse, 'data'> & {
  data?: GroupData[];
}

type GetGroupResponse = Omit<ServiceResponse, 'data'> & {
  data?: GroupWithMembers
}

type GETGroupBalanceDetailsByUserResponse = Omit<ServiceResponse, "data"> & {
  data?: GroupBalanceDetails
}

type GETBalancesByUserGroupsResponse = Omit<ServiceResponse, "data"> & {
  data?: BalancesByUserGroups
}

async function getAllGroupsService(): Promise<GetAllGroupsResponse> {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new Error('Unauthorized');
    }
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

async function getGroupBalanceDetailsByGroup(groupId: string): Promise<GETGroupBalanceDetailsByUserResponse> {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  try {
    const response = await getGroupBalanceDetails(groupId, session?.user?.id as string);

    return { success: true, data: response };
  }
  catch (e) {
    return { success: false, error: e.message };
  }
}

async function getBalancesByUserGroupsService(): Promise<GETBalancesByUserGroupsResponse> {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  try {
    const response = await getBalancesByUserGroups(session?.user?.id as string);

    return { success: true, data: response };
  }
  catch (e) {
    return { success: false, error: e.message };
  }
}

export { 
  getAllGroupsService, 
  getGroupDetailsService,
  getGroupBalanceDetailsByGroup,
  getBalancesByUserGroupsService
};