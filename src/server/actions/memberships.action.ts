'use server'
import { auth } from '@/lib/auth';
import { type ServiceResponse } from '@/types/service-response.type';

import { 
  createMembership, 
  deleteMembership,
  isUserMemberOfGroup
} from '@/server/data/memberships.data';
import { getUserByEmail } from '@/server/data/users.data';
import { isGroupOwner } from '@/server/data/groups.data';
import { hasSomeTransactions } from '@/server/data/transactions.data';
import { Membership } from '@/types/memberships.type';


/**
 * Create a new membership.
 * 
 * Check whether a user with the provided email exists and if the user is not a member of the group.
 * @param data 
 * @returns 
 * - If user does not exist or is already a member, return failure with an error message.
 */
async function createMembershipAction({ userEmail, groupId }: { userEmail: string, groupId: string }): Promise<ServiceResponse> {
  const session = await auth();

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  try {
    const user = await getUserByEmail(userEmail);
    if (!user) throw new Error("A User with the provided email does not exist");

    const isMemberAlready = await isUserMemberOfGroup({groupId, userId: user.id as string});
    if (isMemberAlready) throw new Error("User is already a member");

    await createMembership({groupId, userId: user.id as string});
    return { success: true };
  }
  catch (e) {
    return { success: false, error: e.message };
  }
}


/**
 * Delete a membership.
 * 
 * Checks if the user does not have transactions in the group and is not the owner.
 * @param param0 
 * @returns 
 * - If user has transactions in the group or is the owner, return failure with an error message.
 * - If the user is not a member of the group, return failure with an error message.
 */
async function deleteMembershipAction({ groupId, userId }: Membership): Promise<ServiceResponse> {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  try {
    const isOwner = await isGroupOwner({groupId, createdById: userId});
    if (isOwner) throw new Error("Owner cannot be deleted. If you wish to delete the group itself, ensure all other members have been removed.");

    const hasTransactions = await hasSomeTransactions(groupId, userId);
    if (hasTransactions) throw new Error("This user has transactions in the group and cannot be deleted");

    await deleteMembership({groupId, userId});
    return { success: true };
  }
  catch (e) {
    return { success: false, error: e.message };
  }
}

export {
    createMembershipAction,
    deleteMembershipAction
}