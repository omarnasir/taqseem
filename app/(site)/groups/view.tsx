"use client";
import { Divider, Stack, Text, VStack } from "@chakra-ui/react";

import GroupsList from "./_components/groups-list";
import AddGroup from "./_components/add-group";

import { type GroupData } from "@/app/_types/model/groups";

export default function GroupsView({ groups }: {groups: GroupData[]}) {

  return (
    <Stack direction={'column'} spacing={4} display={'flex'}>
      <VStack alignItems={'flex-start'} paddingX={{ base: 0, md: 3 }}>
        <Text fontSize='lg' fontWeight='400'>Groups</Text>
        <Text fontSize='sm' fontWeight='300'>Manage your groups.</Text>
      </VStack>
      <GroupsList {...{ groups: groups }} />
      <Divider />
      <AddGroup />
    </Stack >
  )
}
