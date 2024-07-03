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

import { type GroupBalanceDetailsWithName } from '@/types/groups.type';
import { type BalancesByUserGroups } from '@/types/users.type';


type GetAllGroupsResponse = ServiceResponse<GroupData[]>
type GetGroupResponse = ServiceResponse<GroupWithMembers>
type GETGroupBalanceDetailsByUserResponse = ServiceResponse<GroupBalanceDetailsWithName>
type GETBalancesByUserGroupsResponse = ServiceResponse<BalancesByUserGroups>


/**
 * Get all groups by the session user ID.
 * @returns
 */
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


/**
 * Get group details by group ID.
 * @param groupId 
 * @returns 
 */
async function getGroupDetailsService(groupId: string): Promise<GetGroupResponse> {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  try {
    const response = await getGroupById({groupId, userId: session.user.id as string});

    return { success: true, data: response };
  }
  catch (e) {
    return { success: false, error: e.message };
  }
}

/**
 * Get each member's balance details by group ID.
 * 
 * Checks if the user is a member of the group and whether the group exists. It will throw an error otherwise.
 * 
 * Since the response from getGroupBalanceDetails does not contain the group name, we can use the name attribute 
 * from the returned group details.
 * @param groupId 
 * @returns 
 */
async function getGroupBalanceDetailsByGroup(groupId: string): Promise<GETGroupBalanceDetailsByUserResponse> {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  try {
    const group = await getGroupById({groupId, userId: session.user.id as string});
    const response = await getGroupBalanceDetails(groupId);

    return {
      success: true, 
      data: {
        ...response,
        groupName: group.name
      }
    };
  }
  catch (e) {
    return { success: false, error: e.message };
  }
}

/**
 * Get balances by user groups. Use the session user ID to get the balances.
 * @returns
 */
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