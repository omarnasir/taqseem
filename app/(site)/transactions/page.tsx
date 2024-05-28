"use server";
import TransactionsView from "./view";
import { getGroupDetailsService } from "@/app/_service/groups";
import { getUserTransactionsByGroupIdService } from "@/app/_service/transactions";


export default async function TransactionsPage({ params, searchParams }:
  { params: Record<string, string>, searchParams: string }) {
  
  const groupId = new URLSearchParams(searchParams).get('id') as string

  const groupResponse = await getGroupDetailsService(groupId as string);
  if (!groupResponse.success) {
    return <div>{groupResponse.error}</div>;
  }

  const transactionsResponse = await getUserTransactionsByGroupIdService(groupId, undefined);
  if (!transactionsResponse.success) {
    return <div>{transactionsResponse.error}</div>;
  }
  return (groupResponse.data && transactionsResponse.data &&
    <TransactionsView group={groupResponse.data} transactions={transactionsResponse.data.groupedTransactions}
      firstCursor={transactionsResponse.data.cursor as number} />
  );
}
