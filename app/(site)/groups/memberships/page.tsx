"use server";
import MembershipsView from "./view";
import { getMembershipsByGroupIdService } from "@/app/_service/memberships";


export default async function MembershipsPage({ params, searchParams }:
  { params: Record<string, string>, searchParams: string }
) {
  const group = JSON.parse(new URLSearchParams(searchParams).get('data') as string);
  const memberships = await getMembershipsByGroupIdService(group.id).then((response) => response.data ? response.data : undefined);

  return (memberships &&
    <MembershipsView memberships={memberships} group={group} />
  );
}
