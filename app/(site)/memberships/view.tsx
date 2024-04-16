'use client'
import { Divider, Stack, Text, VStack } from "@chakra-ui/react";

import GroupMembersList from "./_components/members-list"
import GroupAddUser from "./_components/add-member";

import { GroupData } from "@/app/_types/model/groups";
import { UserBasicData } from "@/app/_types/model/users";


export default function MembershipsView({ group, memberships }:
   { group: GroupData, memberships: UserBasicData[] }
) {
  return (
    <Stack direction={'column'} spacing={4} display={'flex'}>
      <VStack alignItems={'flex-start'} paddingX={{ base: 0, md: 3 }}>
        <Text fontSize='lg' fontWeight='400'>Members - {group.name}</Text>
        <Text fontSize='sm' fontWeight='300'>Add or remove members.</Text>
      </VStack>
      <Divider />
      <GroupMembersList group={group} users={memberships} />
      <Divider />
      <GroupAddUser group={group} />
    </Stack>
  )
}