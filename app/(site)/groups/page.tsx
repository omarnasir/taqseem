"use server";
import { auth } from "@/auth";

import GroupsView from "./view";
import { getAllGroupsService } from "@/app/_service/groups";


export default async function GroupsPage() {
  const session = await auth();
  const groups = await getAllGroupsService().then((response) => response.data ? response.data : undefined);
  
  return (groups &&
    <GroupsView groups={groups} sessionUserId={session?.user?.id as string} />
  );
}
