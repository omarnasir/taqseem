"use server";
import { 
  getAmountOwedByGroupAndUserId, 
  getTransactionsByGroupAndUserId,
  getTransactionsByUserIdAndDate,
  type GroupedTransactions
 } from '@/app/_data/transactions';
import {
 type TransactionWithDetails
} from "@/app/_types/model/transactions";
import { Response } from '@/app/_types/response';
import { auth } from '@/auth';


type GETGroupedTransactionsResponse = Omit<Response, "data"> & {
  data?: {
    groupedTransactions: GroupedTransactions,
    cursor: number | undefined
  }
}

type GETTransactions = Omit<Response, "data"> & {
  data?: TransactionWithDetails[]
}

async function getUserTransactionsByGroupIdService(groupId: string, cursor: number | undefined): Promise<GETGroupedTransactionsResponse> {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  try {
    const response = await getTransactionsByGroupAndUserId(groupId, session?.user?.id as string, cursor);

    return { success: true, data: response };
  }
  catch (e) {
    return { success: false, error: e.message };
  }
}

async function getUserAmountOwedByGroupService(groupId: string): Promise<Response> {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  try {
    const response = await getAmountOwedByGroupAndUserId(groupId, session?.user?.id as string);

    return { success: true, data: response };
  }
  catch (e) {
    return { success: false, error: e.message };
  }
}


async function getUserTransactionsByDateService(date: string): Promise<GETTransactions> {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  try {
    const response = await getTransactionsByUserIdAndDate(session?.user?.id as string, date);

    return { success: true, data: response };
  }
  catch (e) {
    return { success: false, error: e.message };
  }
}

export {
  getUserTransactionsByGroupIdService,
  getUserAmountOwedByGroupService,
  getUserTransactionsByDateService,
  type GroupedTransactions
}