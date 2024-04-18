'use server'
import { type Response } from '@/app/_types/response';

import { auth } from '@/auth';
import { 
    type CreateMembershipArgs
  } from '@/app/_types/model/memberships';
import { createMembership, deleteMembership } from '@/app/_data/memberships';


async function createMembershipAction(data: CreateMembershipArgs): Promise<Response> {
  const session = await auth();

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  try {
    await createMembership(data.userEmail, data.groupId);
    return { success: true };
  }
  catch (e) {
    return { success: false, error: e.message };
  }
}

async function deleteMembershipAction(groupId: string, userId: string): Promise<Response> {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  try {
    await deleteMembership(groupId, userId);
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