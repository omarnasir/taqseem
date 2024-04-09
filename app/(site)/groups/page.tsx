"use server";
import { auth } from "@/auth";

import GroupsView from "./_components/view";
import { getGroupsByUserId } from "@/app/_db/users";

export default async function GroupsPage() {
  const session = await auth();
  let data;

  try {
    data = await getGroupsByUserId(session?.user?.id as string)
  }
  catch (e) {
    console.error(e);
  }

  return (data &&
    <GroupsView groups={data} />
  );
}
