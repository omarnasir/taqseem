"use server";
import { getTransactionsByGroupAndUserId,
  type GroupedTransactions
 } from '@/app/_data/transactions';
import { Response } from '@/app/_types/response';
import { auth } from '@/auth';


type GETGroupedTransactionsResponseType = Omit<Response, "data"> & {
  data?: {
    groupedTransactions: GroupedTransactions,
    cursor: number | undefined
  }
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