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
      <SimpleGrid spacing={2}>
        {users.length > 0 ? users.map((user) => (
          <Card key={user.id}
            size={'xs'}
            variant={'infoCard'}>
            <CardBody paddingY={4}>
              <HStack justifyContent={'space-between'} w='100%'>
                <CustomCardIcon icon={MdPerson} styleProps={{ marginX: '4' }} />
                <Heading w='40%'
                  fontSize={'lg'}
                  fontWeight={400}>{user.name}</Heading>
                {(group.createdById === sessionData?.user?.id ||
                  user.id === sessionData?.user?.id) &&
                  <VStack w='30%'>
                    <Button leftIcon={<MdPersonRemove />}
                      w='100%'
                      variant={'delete'}
                      fontSize={'sm'}
                      onClick={onOpen}>
                      Remove
                    </Button>
                    <Confirm isOpen={isOpen} onClose={onClose} callback={() => {
                      onRemoveUser(user.id); onClose();
                    }} mode="removeUser" />
                  </VStack>
                }
              </HStack>
            </CardBody>
          </Card>
        )) : <Text>No members</Text>}
      </SimpleGrid>
    </Stack>

  );
}