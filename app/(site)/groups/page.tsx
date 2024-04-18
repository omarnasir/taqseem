"use server";
import GroupsView from "./view";
import { getAllGroupsService } from "@/app/_service/groups";


export default async function GroupsPage() {
  const response = await getAllGroupsService();
  if (!response.success) {
    return <div>No groups found!</div>;
  }

  return (response.data &&
    <GroupsView groups={response.data} />
  );
}
