'use server'
import { type ServiceResponse } from '@/types/service-response.type';

import { auth } from '@/lib/auth';

import {
  createActivity
} from '@/server/data/activities.data';
import { type CreateTransaction, type UpdateTransaction } from '@/types/transactions.type';
import { ActivityTypeEnum } from '@/lib/db/constants';


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
      createdById: session.user.id as string,
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