"use server";
import { 
  getTransactionById,
  getTransactionsByGroupId,
  getTransactionsByUserIdAndDate,
 } from '@/server/data/transactions.data';
import {
  TransactionWithDetails,
  type GetTransactionsInput,
  type GetTransactionsResponse
} from "@/types/transactions.type";
import { type ActivityHistoryItem } from "@/types/activities.type";
import { ServiceResponse } from '@/types/service-response.type';
import { auth } from '@/lib/auth';


type GETGroupedTransactionsResponse = ServiceResponse<GetTransactionsResponse>
type GETActivityHistory = ServiceResponse<ActivityHistoryItem[]>
type GETTransactionResponse = ServiceResponse<TransactionWithDetails>


/**
 * Get transaction by transaction Id.
 * @param input
 * @returns
 */
async function getTransactionByIdService(transactionId: number): Promise<GETTransactionResponse> {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  try {
    const response = await getTransactionById(transactionId);

    return { success: true, data: response };
  }
  catch (e) {
    throw new Error(e.message);
  }
}


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


async function getActivityHistoryByTimePeriodService(): Promise<GETActivityHistory> {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  try {
    const transactions = await getTransactionsByUserIdAndDate(session?.user?.id as string);
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
    //     missingDates.push(date.toLocaleDateString('en-ca', {
    //       month: 'short',
    //       day: '2-digit'
    //     }));
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
  getTransactionByIdService,
  getUserTransactionsByGroupIdService,
  getActivityHistoryByTimePeriodService
}