"use server";
import DashboardView from "./view";
import { getBalancesByUserGroupsService } from "@/app/_service/groups";
import { getActivityHistoryByTimePeriodService } from "@/app/_service/transactions";
import { auth } from "@/auth";


export default async function DashboardPage() {
  const [sessionData, userGroupsBalance, activityHistory ] = await Promise.all([
    auth(),
    getBalancesByUserGroupsService().then((response) => response.data ? response.data : []),
    getActivityHistoryByTimePeriodService().then((response) => response.data ? response.data : [])
  ]);

  const totalBalance = Object.values(userGroupsBalance).reduce((acc, group) => acc + group.balance, 0);

  return (
    <DashboardView userGroupsBalance={userGroupsBalance} activityHistory={activityHistory} sessionData={sessionData}
    totalBalance={totalBalance}/>
  );
}