"use server";
import ActivityView from "./view";
import { getActivityService } from "@/app/_service/activities";


export default async function TransactionsPage() {

  const activityResponse = await getActivityService(undefined);
  
  if (!activityResponse.success) {
    return <div>{activityResponse.error}</div>;
  }

  return (activityResponse.data &&
    <ActivityView activities={activityResponse.data.activities} firstCursor={activityResponse.data.cursor as number} />
  );
}
