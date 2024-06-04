"use server";
import GroupsView from "./view";
import { getAllGroupsService } from "@/app/_service/groups";


export default async function GroupsPage() {
  const groups = await getAllGroupsService().then((response) => response.data ? response.data : undefined);
  
  return (groups &&
    <GroupsView groups={groups} />
  );
}
