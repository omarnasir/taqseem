"use server";
import { auth } from "@/lib/auth";
import DashboardView from "./dashboard.view";
import { getBalancesByUserGroupsService } from "@/server/service/groups.service";
import { getActivityHistoryByTimePeriodService } from "@/server/service/transactions.service";


export default async function DashboardPage() {
  const [userGroupsBalance, activityHistory, sessionData ] = await Promise.all([
    getBalancesByUserGroupsService(),
    getActivityHistoryByTimePeriodService(),
    auth()
  ]);

  if (!userGroupsBalance.success || !activityHistory.success) {
    return null;
  }

  return (
    <DashboardView userGroupsBalance={userGroupsBalance.data} activityHistory={activityHistory.data}
      user={sessionData?.user}/>
  );
}