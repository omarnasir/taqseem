"use server";
import { auth } from "@/auth";

import GroupsView from "./view";
import { getAllGroupsService } from "@/app/_service/groups";


export default async function GroupsPage() {
  const session = await auth();
  const response = await getAllGroupsService();

  if (!response.success) {
    return null;
  }
  
  return (
    <GroupsView groups={response.data} sessionUserId={session?.user?.id as string} />
  );
}
