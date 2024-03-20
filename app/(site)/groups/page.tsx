"use server";
import { authServer } from "@/app/_lib/auth";

import GroupsView from "./_components/view";
import { getGroupsByUserId } from "@/app/_data/users";

export default async function GroupsPage() {
  const session = await authServer();
  let data;

  try {
    data = await getGroupsByUserId(session?.user?.id)
  }
  catch (e) {
    console.error(e);
  }

  return (data &&
    <GroupsView groups={data} />
  );
}
