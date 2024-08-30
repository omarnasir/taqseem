"use server";
import { getGroupBalanceDetailsByGroup } from "@/server/service/groups.service";

import { SettleView } from "./settle.view";


export default async function SettlePage({ params: { groupId } } : { params: { groupId: string } }) {
  const response = await getGroupBalanceDetailsByGroup(groupId)

  if (!response.success) {
    return null
  }

  const { groupBalanceDetails, simplifiedBalances } = response.data!;

  return (
    <SettleView groupId={groupId} groupBalanceDetails={groupBalanceDetails} settlementDetails={simplifiedBalances} />
  )
}