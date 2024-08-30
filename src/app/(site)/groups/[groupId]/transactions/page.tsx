"use server";
import TransactionsView from "./transactions.view";
import { getGroupDetailsService } from "@/server/service/groups.service";
import { getUserTransactionsByGroupIdService } from "@/server/service/transactions.service";
import { auth } from "@/lib/auth";


export default async function TransactionsPage({ params: { groupId } }:
  { params: { groupId: string } }) {

  const [groupResponse, transactionsResponse, sessionData] = await Promise.all([
    getGroupDetailsService(groupId),
    getUserTransactionsByGroupIdService({
      groupId: groupId,
      cursor: new Date().toISOString(),
      direction: 'next',
      isFirstFetch: true
    }),
    auth()
  ]);

  if (!groupResponse.success || !transactionsResponse.success) {
    return null;
  }

  return (groupResponse.data && transactionsResponse.data &&
    <TransactionsView group={groupResponse.data} transactionsInitialData={transactionsResponse.data} sessionData={sessionData}/>
  );
}
