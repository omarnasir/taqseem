'use client'
import {
  Button,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  Box,
  Link,
  CardBody,
  Card,
  CardHeader,
  Flex,
  Stack,
  StackDivider
}
  from "@chakra-ui/react";
import { MdPerson, MdPersonRemove } from 'react-icons/md'

import { deleteMembership } from "@/client/services/membershipService";
import { CustomToast } from "@/components/ui/toast";
import { type UserMembershipByGroup } from "@/types/model/memberships";
import { GroupData } from "@/types/model/groups";
import { useSession } from "next-auth/react";

type GroupDetailsProps = {
  group: GroupData,
  users: UserMembershipByGroup[],
  setUsers: React.Dispatch<React.SetStateAction<UserMembershipByGroup[]>>
}

export default function GroupMembers({ group, users, setUsers
}: GroupDetailsProps) {
  const { data: sessionData } = useSession();
  const { addToast } = CustomToast()

  async function onRemoveUser(userId: string) {
    const res = await deleteMembership({ groupId: group.id, userId: userId })
    if (res.success) {
      addToast('User removed from group', null, 'success')
      setUsers(users.filter(user => user.id !== userId))
    }
    else {
      addToast('Error removing user from group', res.error, 'error')
    }
  }

  return (
    <Stack direction={'column'} spacing={4} w='inherit'>
      <Card mb={6}
        p={1}
        size='sm'
        variant={'outline'}
        bg={'itemBgGray'}
        borderRadius={8}>
        <CardHeader>
          <Heading
            alignSelf={'flex-start'}
            size='md'
            mb={2}
            fontWeight='400'>{group.name}</Heading>
          <Text size='sm' fontWeight='300'>Add or remove members.</Text>
        </CardHeader>
        <CardBody marginX={1}>
          <Stack divider={<StackDivider />} spacing='3'>
            {users.length > 0 ? users.map((user) => (
              <Flex flexDirection={'row'} key={user.id} alignItems={'center'}
                justifyContent={'space-between'}>
                <Flex flexDirection={'row'} alignItems={'center'}>
                  <MdPerson />
                  <Text ml={4} lineHeight={2}>{user.name}</Text>
                </Flex>
                {(group.createdById === sessionData?.user?.id ||
                  user.id === sessionData?.user?.id) &&
                  <Button leftIcon={<MdPersonRemove />} size='sm'
                    variant={'outline'} colorScheme={'red'}
                    onClick={() => onRemoveUser(user.id)}>
                    Remove
                  </Button>}
              </Flex>
            )) : <Text>No members</Text>}
          </Stack>
        </CardBody>
      </Card>
    </Stack>

  );
}