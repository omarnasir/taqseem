'use server'
import { type Response } from '@/app/_types/response';
import { auth } from '@/auth';
import { createGroupByUserId, deleteGroupById } from '@/app/_data/groups';


async function createGroupAction(groupName: string): Promise<Response> {
  const session = await auth();

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  try {
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

async function deleteGroupAction(groupId: string): Promise<Response> {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  try {
    await deleteGroupById({
      id: groupId,
      createdById: session.user.id as string
    });
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