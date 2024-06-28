"use server";
import DashboardView from "./view";
import { getBalancesByUserGroupsService } from "@/server/service/groups.service";
import { getActivityHistoryByTimePeriodService } from "@/server/service/transactions.service";


export default async function DashboardPage() {
  const [userGroupsBalance, activityHistory ] = await Promise.all([
    getBalancesByUserGroupsService(),
    getActivityHistoryByTimePeriodService()
  ]);

  if (!userGroupsBalance.success || !activityHistory.success) {
    return null;
  }

  return (
    <DashboardView userGroupsBalance={userGroupsBalance.data} activityHistory={activityHistory.data}/>
  );
}