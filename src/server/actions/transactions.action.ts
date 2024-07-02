'use server'
import { type ServiceResponse } from '@/types/service-response.type';

import { auth } from '@/lib/auth';
import {
  type UpdateTransaction,
  type CreateTransaction,
  TransactionWithDetails
} from '@/types/transactions.type';

import {
  createTransaction,
  updateTransaction,
  deleteTransaction
} from '@/server/data/transactions.data';

import {
  createActivityFromTransactionAction
} from '@/server/actions/activities.action';
import { ActivityTypeEnum } from '@/lib/db/constants';

type CreateTransactionResponse = Omit<ServiceResponse, 'data'> & { data?: TransactionWithDetails };
type UpdateTransactionResponse = Omit<ServiceResponse, 'data'> & { data?: TransactionWithDetails };


async function createTransactionAction(groupId: string, data: CreateTransaction): Promise<CreateTransactionResponse> {
  const session = await auth();

  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  console.log(data.paidAt)

  try {
    const newTransaction = await createTransaction(groupId, data)
    await createActivityFromTransactionAction(newTransaction, ActivityTypeEnum.CREATE);
    return { success: true, data: newTransaction};
  }
  catch (e) {
    return { success: false, error: e.message };
  }
}

async function updateTransactionAction(groupId: string, data: UpdateTransaction): Promise<UpdateTransactionResponse> {
  const session = await auth();

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  try {
    const updatedTransaction = await updateTransaction(groupId, data);
    await createActivityFromTransactionAction(updatedTransaction, ActivityTypeEnum.UPDATE);
    return { success: true, data: updatedTransaction };
  }
  catch (e) {
    return { success: false, error: e.message };
  }
}

async function deleteTransactionAction(userId: string,
  groupId: string,
  transactionId: number): Promise<ServiceResponse> {
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