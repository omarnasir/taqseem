"use server";
import { getTransactionsByGroupAndUserId } from '@/app/_data/transactions';
import { Response } from '@/app/_types/response';
import { auth } from '@/auth';
import { TransactionWithDetails } from '@/app/_types/model/transactions';


type GroupedTransactions = {
  year: number,
  data: {
    month: number,
    monthName: string,
    data: TransactionWithDetails[]
  }[]
}[]

type GETGroupedTransactionsResponseType = Omit<Response, "data"> & {
  data?: GroupedTransactions
}

async function getTransactionsByGroupAndUserIdService(groupId: string, cursor: number | undefined): Promise<GETGroupedTransactionsResponseType> {
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

export {
  getTransactionsByGroupAndUserIdService,
  type GroupedTransactions
}