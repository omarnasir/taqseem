"use server";
import { getGroupBalanceDetailsByGroup } from "@/server/service/groups.service";
import { type GroupBalanceDetails } from "@/types/groups.type";

import { SettleView } from "./settle.view";


export type SimplifiedBalances = {
  payor: {
    userId: string,
    userName: string
  }
  payee: {
    userId: string,
    userName: string
  }
  amount: number
}

export default async function SettlePage({ params: { groupId } } : { params: { groupId: string } }) {
  const groupBalancesDetails = await getGroupBalanceDetailsByGroup(groupId).then((response) => response.data as GroupBalanceDetails);

  // Simplify the balances. If 1 user owes money to more than 1 user, the balance is the sum of all the debts
  const balances: SimplifiedBalances[] = [];
  // find all users with debts and sort them
  const debts = structuredClone(groupBalancesDetails.users.filter(user => user.balance < 0).sort((a, b) => a.balance - b.balance))
  // find all users with credits and sort them
  const credits = structuredClone(groupBalancesDetails.users.filter(user => user.balance > 0).sort((a, b) => b.balance - a.balance))
  // take the first user with the highest debt, and the first user with the highest credit
  // if the debt is higher than the credit, the credit is settled and the debt is reduced by the credit amount
  // if the credit is higher than the debt, the debt is settled and the credit is reduced by the debt amount
  // if the credit is equal to the debt, both are settled
  while (debts.length > 0 && credits.length > 0) {
    const settlementAmount = Math.min(Math.abs(debts[0].balance), credits[0].balance);
    balances.push({ payor: {userName : debts[0].userName, userId: debts[0].userId},
      payee: {userName : credits[0].userName, userId: credits[0].userId}, amount: settlementAmount });
    debts[0].balance += settlementAmount;
    credits[0].balance -= settlementAmount;
    if (debts[0].balance === 0) debts.shift();
    if (credits[0].balance === 0) credits.shift();
  }

  return (
    <SettleView groupId={groupId} groupBalancesDetails={groupBalancesDetails} settlementDetails={balances} />
  )
}