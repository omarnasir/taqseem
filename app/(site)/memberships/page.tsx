'use client'
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"
import { Box } from "@chakra-ui/react";

import { getMembershipsByGroupId } from "@/app/(site)/memberships/_lib/memberships-service";
import GroupMembersList from "./_components/list"
import GroupAddUser from "./_components/add-user";
import Loading from "@/app/(site)/loading";

import { GroupData } from "@/app/_types/model/groups";
import { UserBasicData } from "@/app/_types/model/users";


export default function GroupPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<UserBasicData[]>([]);
  // get params from route query
  const group : GroupData = JSON.parse(useSearchParams().get('data')!)

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await getMembershipsByGroupId(group.id);
      setUsers(res.data);
      setLoading(false);
    }
    fetchUsers();
  }, [group.id]);

  return (
    loading ? <Loading /> :
      <Box w='100%'>
        <GroupMembersList group={group} users={users} setUsers={setUsers} />
        <GroupAddUser group={group} users={users} setUsers={setUsers} />
      </Box>
  )
}