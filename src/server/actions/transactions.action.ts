'use server'
import { auth } from '@/lib/auth';

import { type ServiceResponse } from '@/types/service-response.type';

import {
  type UpdateTransaction,
  type CreateTransaction,
  TransactionWithDetails
} from '@/types/transactions.type';

import {
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '@/server/data/transactions.data';

import {
  createActivityFromTransactionAction
} from '@/server/actions/activities.action';
import { ActivityTypeEnum } from '@/lib/db/constants';
import { getMembershipsByGroupAndUserId } from '@/server/data/memberships.data';


type CreateTransactionResponse = Omit<ServiceResponse, 'data'> & { data?: TransactionWithDetails };
type UpdateTransactionResponse = Omit<ServiceResponse, 'data'> & { data?: TransactionWithDetails };

/**
 * Create a new transaction.
 * 
 * Function getMembershipsByGroupAndUserId will throw an error if the session userID is not part of the group.
 * This prevents users from creating transactions in groups they are not part of.
 * 
 * If the transaction was created successfully, create an activity log for the transaction.
 * @param groupId 
 * @param data 
 * @returns Response with the new transaction data.
 * - If the transaction is created by a user who is not part of the group, return failure with error message.
 * - If any userId involved in the transaction (paidById or transactionDetails.userId) is not part of the group, 
 * return failure with error message.
 */
async function createTransactionAction(groupId: string, data: CreateTransaction): Promise<CreateTransactionResponse> {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new Error('Unauthorized');
    }

    const memberships = await getMembershipsByGroupAndUserId(groupId, session.user.id as string);

    const paidByUser = memberships.some(member => member.id === data.paidById);
    const transactionDetailsUser = data.transactionDetails?.every(detail => {
      return memberships.some(member => member.id === detail.userId);
    });
    if (!paidByUser || !transactionDetailsUser) {
      throw new Error("Provided users are not part of the group");
    }
    const newTransaction = await createTransaction(session.user.id as string, data)
    await createActivityFromTransactionAction(newTransaction, ActivityTypeEnum.CREATE);
    return { success: true, data: newTransaction};
  }
  catch (e) {
    return { success: false, error: e.message };
  }
}

/**
 * Update an existing transaction.
 * 
 * Function getMembershipsByGroupAndUserId will throw an error if the session userID is not part of the group.
 * This prevents users from updating transactions in groups they are not part of.
 * 
 * If the transaction was updated successfully, create an activity log for the transaction.
 * @param groupId 
 * @param data 
 * @returns Response with the new transaction data.
 * - If the userIds specified in the transaction as part of the Transaction data, either as paidById or
 * transactionDetails.userId are not part of the group, return failure with error message.
 */
async function updateTransactionAction(groupId: string, data: UpdateTransaction): Promise<UpdateTransactionResponse> {
  const session = await auth();

  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  try {
    const memberships = await getMembershipsByGroupAndUserId(groupId, session.user.id as string);

    const paidByUser = memberships.some(member => member.id === data.paidById);
    const transactionDetailsUser = data.transactionDetails?.every(detail => {
      return memberships.some(member => member.id === detail.userId);
    });
    if (!paidByUser || !transactionDetailsUser) {
      throw new Error("Provided users are not part of the group");
    }

    const updatedTransaction = await updateTransaction(session.user.id as string, groupId, data);
    await createActivityFromTransactionAction(updatedTransaction, ActivityTypeEnum.UPDATE);
    return { success: true, data: updatedTransaction };
  }
  catch (e) {
    return { success: false, error: e.message };
  }
}

/**
 * Delete a transaction.
 * 
 * If the transaction was deleted successfully, the related activity logs will be deleted because of the
 * Prisma onDelete cascade rule.
 * @param userId 
 * @param groupId 
 * @param transactionId 
 * @returns Response with success status.
 * - If the requesting user is not part of the group, return failure with error message.
 * - If the transaction does not exist in the group, return failure with error message.
 */
async function deleteTransactionAction(userId: string, groupId: string, transactionId: number): Promise<ServiceResponse> {
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