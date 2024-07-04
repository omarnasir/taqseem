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

import { type GroupBalanceDetailsWithName, type SimplifiedBalances } from '@/types/groups.type';
import { type BalancesByUserGroups } from '@/types/users.type';


type GetAllGroupsResponse = ServiceResponse<GroupData[]>
type GetGroupResponse = ServiceResponse<GroupWithMembers>
type GETGroupBalanceDetailsByUserResponse = ServiceResponse<
  { groupBalanceDetails: GroupBalanceDetailsWithName, simplifiedBalances: SimplifiedBalances[] }
>
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

    // Simplify the balances. If 1 user owes money to more than 1 user, the balance is the sum of all the debts
    const balances: SimplifiedBalances[] = [];
    // find all users with debts and sort them
    const debts = structuredClone(response.users.filter(user => user.balance < 0).sort((a, b) => a.balance - b.balance))
    // find all users with credits and sort them
    const credits = structuredClone(response.users.filter(user => user.balance > 0).sort((a, b) => b.balance - a.balance))
    // take the first user with the highest debt, and the first user with the highest credit
    // if the debt is higher than the credit, the credit is settled and the debt is reduced by the credit amount
    // if the credit is higher than the debt, the debt is settled and the credit is reduced by the debt amount
    // if the credit is equal to the debt, both are settled
    while (debts.length > 0 && credits.length > 0) {
      const settlementAmount = Math.min(Math.abs(debts[0].balance), credits[0].balance);
      balances.push({ payor: {userName : debts[0].userName, userId: debts[0].userId},
        payee: {userName : credits[0].userName, userId: credits[0].userId}, amount: settlementAmount });
      debts[0].balance += settlementAmount;
      credits[0].balance -= settlementAmount;
      if (debts[0].balance === 0) debts.shift();
      if (credits[0].balance === 0) credits.shift();
    }

    return {
      success: true,
      data: {
        groupBalanceDetails: {
          ...response,
          groupName: group.name
        },
        simplifiedBalances: balances
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