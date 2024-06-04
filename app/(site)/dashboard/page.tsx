"use server";
import DashboardView from "./view";
import { getUserAmountOwedForAllGroups } from "@/app/_service/groups";
import { getUserTransactionsByDateService } from "@/app/_service/transactions";
import { auth } from "@/auth";


export type Activity = {
  owe: number,
  getBack: number,
  paidAt: Date,
}


export default async function DashboardPage() {
  const date = new Date();
  date.setDate(date.getDate() - 14);

  const [session, groupsWithAmountOwed, transactions ] = await Promise.all([
    auth(),
    getUserAmountOwedForAllGroups().then((response) => response.data ? response.data : []),
    getUserTransactionsByDateService(date.toLocaleDateString()).then((response) => response.data ? response.data : []),
  ]);

  transactions.forEach((transaction) => {
    transaction.amount = transaction.transactionDetails.find((detail) => detail.userId === session!.user?.id)?.amount ?? 0;
  });

  const dates = transactions.map((transaction) => new Date(transaction.paidAt).toLocaleDateString());
  const missingDates = [];
  for (let i = 0; i < 14; i++) {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);
    if (!dates.includes(date.toLocaleDateString())) {
      missingDates.push(date);
    }
  }
  const finalTransactions : Activity[] = transactions.map((transaction) => ({
    owe: transaction.amount < 0 ? transaction.amount : 0,
    getBack: transaction.amount > 0 ? transaction.amount : 0,
    paidAt: new Date(transaction.paidAt),
  }));

  for (const missingDate of missingDates) {
    finalTransactions.push({
      owe: 0,
      getBack: 0,
      paidAt: missingDate,
    });
  }
  finalTransactions.sort((a, b) => new Date(a.paidAt).getTime() - new Date(b.paidAt).getTime());
  finalTransactions.splice(0, Math.max(0, finalTransactions.length - 14));

  return (
    <DashboardView groups={groupsWithAmountOwed} transactions={finalTransactions} />
  );
}