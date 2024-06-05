"use server";
import DashboardView from "./view";
import { getMembersBalancesByUserGroupsService } from "@/app/_service/groups";
import { getActivityHistoryByTimePeriodService } from "@/app/_service/transactions";
import { auth } from "@/auth";


export default async function DashboardPage() {
  const [sessionData, groupsBalance, activityHistory ] = await Promise.all([
    auth(),
    getMembersBalancesByUserGroupsService().then((response) => response.data ? response.data : []),
    getActivityHistoryByTimePeriodService().then((response) => response.data ? response.data : [])
  ]);

  return (
    <DashboardView groupsBalance={groupsBalance} activityHistory={activityHistory} sessionData={sessionData}/>
  );
}