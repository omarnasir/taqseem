"use server";
import TransactionsView from "./view";
import { getGroupDetailsService } from "@/app/_service/groups";
import { getUserTransactionsByGroupIdService } from "@/app/_service/transactions";
import { auth } from "@/auth";


export default async function TransactionsPage({ params, searchParams }:
  { params: Record<string, string>, searchParams: string }) {
  const sessionData = await auth();
  
  const groupId = new URLSearchParams(searchParams).get('id') as string

  const [groupResponse, transactionsResponse] = await Promise.all([
    getGroupDetailsService(groupId),
    getUserTransactionsByGroupIdService(groupId, undefined)
  ]);

  return (groupResponse.data && transactionsResponse.data &&
    <TransactionsView group={groupResponse.data} transactions={transactionsResponse.data.groupedTransactions}
      firstCursor={transactionsResponse.data.cursor as number}  sessionData={sessionData}/>
  );
}
