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
import CustomCardIcon from "../../_components/cardIcon";

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
      <Text fontSize='lg' fontWeight='400'>Members - {group.name}</Text>
      <Text fontSize='sm' fontWeight='300'>Add or remove members.</Text>
      <SimpleGrid spacing={4} columns={2}>
        {users.length > 0 ? users.map((user) => (
          <Card key={user.id}
            size={'sm'}
            variant={'infoCard'}>
            <CardBody mt={2}>
              <HStack justifyContent={'space-around'} w='100%'>
                <CustomCardIcon icon={MdPerson} />
                <Heading w='70%' borderBottom={'1px solid'}
                  pb={4} ml={1}
                  borderColor={'whiteAlpha.200'}
                  fontSize={'1rem'}
                  fontFamily={'body'}
                  fontWeight={200}>{user.name}</Heading>
              </HStack>
            </CardBody>
            {(group.createdById === sessionData?.user?.id ||
              user.id === sessionData?.user?.id) &&
              <CardFooter w='100%' pt={2} justifyContent={'flex-end'}>
                <Button leftIcon={<MdPersonRemove />} size='sm'
                  width={{ base: '70%', sm: '50%' }}
                  variant={'delete'}
                  fontSize={'0.8rem'}
                  onClick={onOpen}>
                  Remove
                </Button>
                <Confirm isOpen={isOpen} onClose={onClose} callback={() => {
                  onRemoveUser(user.id); onClose();
                }} mode="removeUser" />
              </CardFooter>
            }
          </Card>
        )) : <Text>No members</Text>}
      </SimpleGrid>
    </Stack>

  );
}