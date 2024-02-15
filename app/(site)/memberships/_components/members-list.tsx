'use client'
import {
  Button,
  Text,
  CardBody,
  Card,
  Flex,
  Stack,
  useDisclosure,
  Grid,
  SimpleGrid,
  CardHeader,
  Heading,
  CardFooter,
  Spacer,
  VStack,
  HStack,
  Box,
  Icon
}
  from "@chakra-ui/react";
import { MdPerson, MdPersonRemove } from 'react-icons/md'

import { deleteMembership } from "@/app/(site)/memberships/_lib/memberships-service";
import { CustomToast } from "@/app/_components/toast";
import Confirm from "@/app/(site)/_components/confirm";
import { type UserBasicData } from "@/app/_types/model/users";
import { GroupData } from "@/app/_types/model/groups";
import { useSession } from "next-auth/react";

type GroupDetailsProps = {
  group: GroupData,
  users: UserBasicData[],
  setUsers: React.Dispatch<React.SetStateAction<UserBasicData[]>>
}

export default function GroupMembersList({ group, users, setUsers
}: GroupDetailsProps) {
  const { data: sessionData } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure()
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
    <Stack direction={'column'} spacing={4} mb={6}>
      <Text fontSize='xl' fontWeight='bold'>Members - {group.name}</Text>
      <Text size='sm' fontWeight='300'>Add or remove members.</Text>
      <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
        {users.length > 0 ? users.map((user) => (
          <Card key={user.id}
            size={{ base: 'sm', md: 'md' }}
            variant={'custom'}>
            <CardBody mt={2}>
              <HStack>
                <Icon
                  h='1.5rem' w='15%'
                  opacity={0.7}
                  alignItems={'center'}
                  as={MdPerson} />
                <Heading size='md' fontWeight={300}>{user.name}</Heading>
              </HStack>
            </CardBody>
            {(group.createdById === sessionData?.user?.id ||
              user.id === sessionData?.user?.id) &&
              <CardFooter alignSelf='end'>
                <Button leftIcon={<MdPersonRemove color='rgb(155,90,105)' />} size='sm'
                  variant={'outline'}
                  fontWeight={300}
                  onClick={onOpen}>
                  Remove
                </Button>
                <Confirm isOpen={isOpen} onClose={onClose} callback={() => {
                  onRemoveUser(user.id); onClose();
                }} mode="removeUser" />
              </CardFooter>}
          </Card>
        )) : <Text>No members</Text>}
      </SimpleGrid>
    </Stack>

  );
}