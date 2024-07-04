"use server";
import { auth } from "@/lib/auth";

import { getAllGroupsService } from "@/server/service/groups.service";
import GroupsView from "./groups.view";


export default async function GroupsPage() {
  const session = await auth();
  const response = await getAllGroupsService();

  if (!response.success) {
    return null;
  }

  return (response &&
    <GroupsView groups={response.data} sessionUserId={session?.user?.id as string} />
  );
}
