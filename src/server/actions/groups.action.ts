'use server'
import { type ServiceResponse } from '@/types/service-response.type';
import { auth } from '@/lib/auth';
import { 
  createGroupByUserId, 
  deleteGroupById, 
  getGroupByNameAndMemberId, 
  getMemberCountExcludingCreatedById 
} from '@/server/data/groups.data';


/**
 * Create a new group.
 * 
 * Function getGroupByNameAndCreatedById 
 * @param groupName 
 * @returns 
 * - If the requesting user is part of another group with the same name, return failure with error message.
 */
async function createGroupAction(groupName: string): Promise<ServiceResponse> {
  const session = await auth();

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  try {
    const group = await getGroupByNameAndMemberId({groupName, memberId: session.user.id as string});
    if (group) throw new Error("Group already exists");

    await createGroupByUserId({
      name: groupName,
      createdById: session.user.id as string
    });
    return { success: true };
  }
  catch (e) {
    return { success: false, error: e.message };
  }
}


/**
 * Delete a group.
 * 
 * Function getMemberCountExcludingCreatedById will throw an error if the group contains members other than the 
 * requesting user.
 * 
 * The session user must be the creator of the group to delete it.
 * @param groupId 
 * @returns 
 * - If the requesting user is not the creator of the group, return failure with error message.
 * - If the group still contains members other than the requesting user, return failure with error message.
 */
async function deleteGroupAction(groupId: string): Promise<ServiceResponse> {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  try {
    const memberCount = await getMemberCountExcludingCreatedById({groupId, createdById: session.user.id as string});
    if (memberCount > 0) throw new Error("Group contains members other than you. Please remove them first.");

    await deleteGroupById({groupId, createdById: session.user.id as string});
    return { success: true };
  }
  catch (e) {
    return { success: false, error: e.message };
  }
}

export {
  createGroupAction,
  deleteGroupAction
}