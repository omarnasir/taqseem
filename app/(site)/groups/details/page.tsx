'use client'
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"

import { getUsersByGroupId } from "@/client/services/membershipService";
import GroupMembers from "@/components/groups/memberships"
import GroupAddUser from "@/components/groups/add-user";
import { type UserMembershipByGroup } from "@/types/model/memberships";
import Loading from "@/app/(site)/loading";
import { Box } from "@chakra-ui/react";
import { GroupData } from "@/types/model/groups";


export default function GroupPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<UserMembershipByGroup[]>([]);
  // get params from route query
  const group : GroupData= JSON.parse(useSearchParams().get('data')!)

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await getUsersByGroupId({id: group.id!});
      setUsers(res.data.memberships!);
      setLoading(false);
    }
    fetchUsers();
  }, [group.id]);

  return (
    loading ? <Loading /> :
      <Box w='100%'>
        <GroupMembers group={group} users={users} setUsers={setUsers} />
        <GroupAddUser group={group} users={users} setUsers={setUsers} />
      </Box>
  )
}