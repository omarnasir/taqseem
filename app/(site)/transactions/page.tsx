"use server";
import TransactionsView from "./view";
import { getGroupDetailsService } from "@/app/_service/groups";
import { getTransactionsByGroupAndUserIdService } from "@/app/_service/transactions";


export default async function TransactionsPage({params, searchParams}: 
  { params: Record<string, string>, searchParams: string }) {
  const cursor = parseInt(new URLSearchParams(searchParams).get('cursor') as string) || 0 as number; 
  const groupId = new URLSearchParams(searchParams).get('id') as string
  
  const groupResponse = await getGroupDetailsService(groupId as string);
  if (!groupResponse.success) {
    return <div>{groupResponse.error}</div>;
  }

  const transactionsResponse = await getTransactionsByGroupAndUserIdService(groupId, cursor);
  if (!transactionsResponse.success) {
    return <div>{transactionsResponse.error}</div>;
  }
  return (groupResponse.data && transactionsResponse.data &&
    <TransactionsView group={groupResponse.data} transactions={transactionsResponse.data} />
  );
}
