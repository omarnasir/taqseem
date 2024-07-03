"use server";
import { 
  getTransactionsByGroupId,
  getTransactionsByUserIdAndDate,
 } from '@/server/data/transactions.data';
import {
  type GetTransactionsInput,
  type GetTransactionsResponse
} from "@/types/transactions.type";
import { type ActivityHistoryItem } from "@/types/activities.type";
import { ServiceResponse } from '@/types/service-response.type';
import { auth } from '@/lib/auth';


type GETGroupedTransactionsResponse = ServiceResponse<GetTransactionsResponse>
type GETActivityHistory = ServiceResponse<ActivityHistoryItem[]>


/**
 * Get transactions by group ID. Service to get transactions by group ID using cursor based pagination.
 * @param input 
 * @returns 
 */
async function getUserTransactionsByGroupIdService(input: GetTransactionsInput): Promise<GETGroupedTransactionsResponse> {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  try {
    const response = await getTransactionsByGroupId(input);

    return { success: true, data: response };
  }
  catch (e) {
    return { success: false, error: e.message };
  }
}


async function getActivityHistoryByTimePeriodService(timePeriod?: number): Promise<GETActivityHistory> {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  try {
    if (timePeriod === undefined) timePeriod = 14;
    let date = new Date();
    date.setDate(date.getDate() - timePeriod);
    const transactions = await getTransactionsByUserIdAndDate(session?.user?.id as string, date.toLocaleDateString());
    if (!transactions) throw new Error("No transactions found")

    const dates = transactions.map((transaction) => new Date(transaction.paidAt).toLocaleDateString());
    const missingDates = [];
    for (let i = 0; i < timePeriod; i++) {
      const date = new Date();
      date.setUTCHours(0, 0, 0, 0);
      date.setDate(date.getDate() - i);
      if (!dates.includes(date.toLocaleDateString())) {
        missingDates.push(date);
      }
    }
    const finalTransactions: ActivityHistoryItem[] = transactions.map((transaction) => {
      let { owe, getBack } = { owe: 0, getBack: 0 };
      if (session?.user?.id! === transaction.paidById) {
        getBack = transaction.amount - transaction.transactionDetails.find((detail) => detail.userId === session?.user?.id)?.amount!;
      }
      else {
        owe = transaction.transactionDetails.find((detail) => detail.userId === session?.user?.id)?.amount!;
      };
      const paidAt = new Date(transaction.paidAt);
      return { owe, getBack, paidAt };
    });

    for (const missingDate of missingDates) {
      finalTransactions.push({
        owe: 0,
        getBack: 0,
        paidAt: missingDate,
      });
    }
    finalTransactions.sort((a, b) => new Date(a.paidAt).getTime() - new Date(b.paidAt).getTime());
    finalTransactions.splice(0, Math.max(0, finalTransactions.length - timePeriod));
    return { success: true, data: finalTransactions };
  }
  catch (e) {
    return { success: false, error: e.message };
  }
}

export {
  getUserTransactionsByGroupIdService,
  getActivityHistoryByTimePeriodService
}