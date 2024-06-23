'use server'
import { type Response } from '@/app/_types/response';

import { auth } from '@/auth';
import {
  type UpdateTransaction,
  type CreateTransaction
} from '@/app/_types/model/transactions';

import {
  createTransaction,
  updateTransaction,
  deleteTransaction
} from '@/app/_data/transactions';

import {
  createActivity
} from '@/app/_data/activities';
import { ActivityTypeEnum } from '@/app/_lib/db/constants';

async function createTransactionAction(groupId: string, data: CreateTransaction): Promise<Response> {
  const session = await auth();

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  try {
    const newTransaction = await createTransaction(groupId, data)
    await createActivity({
      groupId: groupId,
      createdById: session.user.id as string,
      action: ActivityTypeEnum.CREATE,
      transactionId: newTransaction.id,
      createdAt: newTransaction.createdAt
    });
    return { success: true };
  }
  catch (e) {
    return { success: false, error: e.message };
  }
}

async function updateTransactionAction(groupId: string, data: UpdateTransaction): Promise<Response> {
  const session = await auth();

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  try {
    const updatedTransaction = await updateTransaction(groupId, data);
    await createActivity({
      groupId: groupId,
      createdById: session.user.id as string,
      action: ActivityTypeEnum.UPDATE,
      transactionId: updatedTransaction.id,
      createdAt: new Date().toISOString()
    });
    return { success: true };
  }
  catch (e) {
    return { success: false, error: e.message };
  }
}

async function deleteTransactionAction(userId: string,
  groupId: string,
  transactionId: number): Promise<Response> {
  const session = await auth();

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  try {
    await deleteTransaction(userId, groupId, transactionId);
    return { success: true };
  }
  catch (e) {
    return { success: false, error: e.message };
  }
}

export {
  createTransactionAction,
  updateTransactionAction,
  deleteTransactionAction
}