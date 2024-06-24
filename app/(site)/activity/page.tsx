"use server";
import ActivityView from "./view";
import { getActivityService } from "@/app/_service/activities";
import { getAllGroupsService } from "@/app/_service/groups";


export default async function TransactionsPage() {
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
    <ActivityView userGroups={userGroups} activities={data.activities} firstCursor={data.cursor as number} />
  );
}
