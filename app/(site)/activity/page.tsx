"use server";
import ActivityView from "./view";
import { getActivityService } from "@/app/_service/activities";


export default async function TransactionsPage() {

  const activityResponse = await getActivityService();
  
  if (!activityResponse.success) {
    return <div>{activityResponse.error}</div>;
  }

  return (activityResponse.data &&
    <ActivityView activities={activityResponse.data} />
  );
}
