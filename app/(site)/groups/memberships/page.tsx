"use server";
import MembershipsView from "./view";
import { getMembershipsByGroupIdService } from "@/app/_service/memberships";


export default async function MembershipsPage({ params, searchParams }:
  { params: Record<string, string>, searchParams: string }
) {
  const group = JSON.parse(new URLSearchParams(searchParams).get('data') as string);
  const response = await getMembershipsByGroupIdService(group.id);
  if (!response.success) {
    return <div>No Memberships found!</div>;
  }

  return (response.data &&
    <MembershipsView memberships={response.data} group={group} />
  );
}
