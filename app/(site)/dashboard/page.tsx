"use server";
import DashboardView from "./view";
import { getBalancesByUserGroupsService } from "@/app/_service/groups";
import { getActivityHistoryByTimePeriodService } from "@/app/_service/transactions";


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