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
    if (timePeriod === undefined) timePeriod = 30;
    let date = new Date();
    date.setDate(date.getDate() - timePeriod);
    const transactions = await getTransactionsByUserIdAndDate(session?.user?.id as string, date.getTime());
    if (!transactions) throw new Error("No transactions found")

    // const dates = transactions.map((transaction) => new Date(transaction.paidAt).toLocaleDateString());
    
    transactions.forEach((transaction) => {
      transaction.paidAt = new Date(transaction.paidAt).toLocaleDateString('en-ca', {
        month: 'short',
        day: '2-digit'
      })
    })

    // const missingDates = [];
    // for (let i = 0; i < timePeriod; i++) {
    //   const date = new Date();
    //   date.setUTCHours(0, 0, 0, 0);
    //   date.setDate(date.getDate() - i);
    //   if (!dates.includes(date.toLocaleDateString())) {
    //     missingDates.push(date);
    //   }
    // }
    // for (const missingDate of missingDates) {
    //   transactions.push({ amount: 0, paidAt: missingDate });
    // }
    // let cumsum: number = 0;

    // transactions.forEach((transaction) => {
    //   cumsum += transaction.amount;
    //   transaction.amount = cumsum;
    // }
    // );

    return { success: true, data: transactions };
  }
  catch (e) {
    return { success: false, error: e.message };
  }
}

export {
  getUserTransactionsByGroupIdService,
  getActivityHistoryByTimePeriodService
}