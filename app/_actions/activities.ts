'use server'
import { type Response } from '@/app/_types/response';

import { auth } from '@/auth';
import {
  type CreateActivity
} from '@/app/_types/model/activities';

import {
  createActivity
} from '@/app/_data/activities';
import { CreateTransaction, UpdateTransaction } from '@/app/_types/model/transactions';
import { ActivityTypeEnum } from '@/app/_lib/db/constants';


async function createActivityFromTransactionAction(transaction: CreateTransaction | UpdateTransaction, action: ActivityTypeEnum): 
  Promise<Response> {
  const session = await auth();

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const amount = transaction.paidById === transaction.createdById ? transaction.amount : 
    transaction.transactionDetails.find(td => td.userId === transaction.createdById)?.amount || 0;

  try {
    await createActivity({
      groupId: transaction.groupId as string,
      createdById: transaction.createdById as string,
      action: action as ActivityTypeEnum,
      transactionId: transaction.id as number,
      createdAt: (action === ActivityTypeEnum.CREATE ? transaction.createdAt : new Date().toISOString()) as string,
      amount: amount as number
    });
    return { success: true };
  }
  catch (e) {
    return { success: false, error: e.message };
  }
}


export {
  createActivityFromTransactionAction
}