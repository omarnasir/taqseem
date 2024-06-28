'use server'
import { type ServiceResponse } from '@/types/service-response.type';

import { auth } from '@/lib/auth';
import { 
    type CreateMembershipArgs
  } from '@/types/memberships.type';
import { createMembership, deleteMembership } from '@/server/data/memberships.data';


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