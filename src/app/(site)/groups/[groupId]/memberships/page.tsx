"use server";
import { getAllGroupsService } from "@/server/service/groups.service";
import MembershipsView from "./memberships.view";
import { getMembershipsByGroupIdService } from "@/server/service/memberships.service";
import { auth } from '@/lib/auth';


export default async function MembershipsPage({ params  }:
  { params: { groupId: string } }
) {
  const session = await auth();
  const groupId = params.groupId;
  const memberships = await getMembershipsByGroupIdService(groupId);
  const groups = await getAllGroupsService();

  if (!memberships.success || !groups.success) {
    return null;
  }

  return (session &&
      <MembershipsView membershipsInitialData={memberships.data} 
        groupsInitialData={groups.data}
        groupId={groupId} 
        sessionUserId={session?.user?.id!} />
  );
}
