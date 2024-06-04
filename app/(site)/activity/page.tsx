"use server";
import ActivityView from "./view";
import { getActivityService } from "@/app/_service/activities";


export default async function TransactionsPage() {

  const data = await getActivityService(undefined).then((response) => response.data ? response.data : undefined);

  return (data &&
    <ActivityView activities={data.activities} firstCursor={data.cursor as number} />
  );
}
