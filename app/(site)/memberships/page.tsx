'use client'
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"
import { Box, Divider, Flex, Stack, Text, VStack } from "@chakra-ui/react";

import { getMembershipsByGroupId } from "@/app/(site)/memberships/_lib/memberships-service";
import GroupMembersList from "./_components/members-list"
import GroupAddUser from "./_components/add-member";
import Loading from "@/app/(site)/loading";

import { GroupData } from "@/app/_types/model/groups";
import { UserBasicData } from "@/app/_types/model/users";


export default function GroupPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<UserBasicData[]>([]);
  // get params from route query
  const group: GroupData = JSON.parse(useSearchParams().get('data')!)

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
      <Stack direction={'column'} spacing={4} display={'flex'}>
        <VStack alignItems={'flex-start'} paddingX={{ base: 0, md: 3 }}>
          <Text fontSize='lg' fontWeight='400'>Members - {group.name}</Text>
          <Text fontSize='sm' fontWeight='300'>Add or remove members.</Text>
        </VStack>
        <Divider />
        <GroupMembersList group={group} users={users} setUsers={setUsers} />
        <Divider />
        <GroupAddUser group={group} users={users} setUsers={setUsers} />
      </Stack>
  )
}