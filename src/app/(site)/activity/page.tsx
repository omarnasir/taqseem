"use server";
import ActivityView from "./view";
import { getActivityService } from "@/server/service/activities.service";
import { getAllGroupsService } from "@/server/service/groups.service";
import { auth } from "@/lib/auth";


export default async function TransactionsPage() {
  const sessionData = await auth();
  const userGroups = await getAllGroupsService().then((response) => response.data ? response.data : undefined);
  if (!userGroups) {
    return (
      <div>
        <h1>Failed to load groups.</h1>
      </div>
    )
  }
  const data = await getActivityService(userGroups.map(group => group.id),undefined).then((response) => response.data ? response.data : undefined);

  return (data &&
    <ActivityView userGroups={userGroups} activities={data.activities} firstCursor={data.cursor as number} 
    sessionData={sessionData}/>
  );
}
