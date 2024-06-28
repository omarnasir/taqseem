"use server";
import { 
  getTransactionsByGroupId,
  getTransactionsByUserIdAndDate,
 } from '@/server/data/transactions.data';
import {
 type GroupedTransactions
} from "@/types/transactions.type";
import { type ActivityHistoryItem } from "@/types/activities.type";
import { ServiceResponse } from '@/types/service-response.type';
import { auth } from '@/lib/auth';

type GETGroupedTransactionsResponse = Omit<ServiceResponse, "data"> & {
  data?: {
    groupedTransactions: GroupedTransactions,
    cursor: number | undefined
  }
}

type GETActivityHistory = Omit<ServiceResponse, "data"> & {
  data?: ActivityHistoryItem[]
}


async function getUserTransactionsByGroupIdService(groupId: string, cursor: number | undefined): Promise<GETGroupedTransactionsResponse> {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  try {
    const response = await getTransactionsByGroupId(groupId, cursor);
    const { transactions, cursor: newCursor } = response;
    let groupedTransactions: GroupedTransactions = []
    for (const transaction of transactions) {
      const date = new Date(transaction.paidAt);
      const month = date.getMonth()
      const year = date.getFullYear()
      if (!groupedTransactions.find((group) => group.year === year)) {
        groupedTransactions.push({ year, data: [] })
      }
      const groupIndex = groupedTransactions.findIndex((group) => group.year === year)
      if (!groupedTransactions[groupIndex].data.find((data) => data.month === month)) {
        groupedTransactions[groupIndex].data.push({ month, monthName: date.toLocaleString('default', { month: 'long' }), data: [] })
      }
      const monthIndex = groupedTransactions[groupIndex].data.findIndex((data) => data.month === month)
      groupedTransactions[groupIndex].data[monthIndex].data.push(transaction)
    }
    groupedTransactions.sort((a, b) => b.year - a.year)
    for (const group of groupedTransactions) {
      group.data.sort((a, b) => b.month - a.month)
    }

    return { success: true, data: { groupedTransactions, cursor: newCursor } };
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