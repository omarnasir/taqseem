"use server";
import DashboardView from "./view";
import { getUserAmountOwedForAllGroups } from "@/app/_service/groups";
import { getUserTransactionsByDateService } from "@/app/_service/transactions";
import { auth } from "@/auth";


export default async function DashboardPage() {
  const session = await auth();
  const groupsWithAmountOwedResponse = await getUserAmountOwedForAllGroups();
  if (!groupsWithAmountOwedResponse.success) {
    return <div>{groupsWithAmountOwedResponse.error}</div>;
  }
  
  const date = new Date();
  date.setDate(date.getDate() - 14);
  const transactionsResponse = await getUserTransactionsByDateService(date.toISOString());
  if (!transactionsResponse.success) {
    return <DashboardView groups={groupsWithAmountOwedResponse.data!} />;
  }
  const transactions = transactionsResponse.data!.map((transaction) => ({
    amount: transaction.transactionDetails.find((detail) => detail.userId === session!.user?.id)?.amount ?? 0,
    paidAt: transaction.paidAt,
  }));
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
  for (const missingDate of missingDates) {
    transactions.push({
      amount: 0,
      paidAt: missingDate,
    });
  }
  transactions.sort((a, b) => new Date(a.paidAt).getTime() - new Date(b.paidAt).getTime());
  transactions.splice(0, Math.max(0, transactions.length - 30));
  const finalTransactions = transactions.map((transaction) => ({
    owe: transaction.amount < 0 ? transaction.amount : 0,
    getBack: transaction.amount > 0 ? transaction.amount : 0,
  }));

  return (
    <DashboardView groups={groupsWithAmountOwedResponse.data!} transactions={finalTransactions} />
  );

}