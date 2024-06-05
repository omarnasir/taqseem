"use server";
import TransactionsView from "./view";
import { getGroupDetailsService } from "@/app/_service/groups";
import { getUserTransactionsByGroupIdService } from "@/app/_service/transactions";
import { auth } from "@/auth";


export default async function TransactionsPage({ params: { groupId } }:
  { params: { groupId: string } }) {

  const [groupResponse, transactionsResponse, sessionData] = await Promise.all([
    getGroupDetailsService(groupId),
    getUserTransactionsByGroupIdService(groupId, undefined),
    auth()
  ]);

  return (groupResponse.data && transactionsResponse.data &&
    <TransactionsView group={groupResponse.data} transactions={transactionsResponse.data.groupedTransactions}
      firstCursor={transactionsResponse.data.cursor as number}  sessionData={sessionData}/>
  );
}
