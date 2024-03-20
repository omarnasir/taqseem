'use client'
import {
  Button,
  Text,
  CardBody,
  Card,
  useDisclosure,
  SimpleGrid,
  Heading,
  VStack,
}
  from "@chakra-ui/react";
import { MdPerson, MdPersonRemove } from 'react-icons/md'

import { deleteMembership } from "@/app/(site)/memberships/_lib/memberships-service";
import { CustomToast } from "@/app/_components/toast";
import Confirm from "@/app/(site)/_components/confirm";
import { type UserBasicData } from "@/app/_types/model/users";
import { GroupData } from "@/app/_types/model/groups";
import { useSession } from "next-auth/react";
import { CustomCardIcon } from "@/app/(site)/_components/cardIcon";

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
      <SimpleGrid spacing={1}>
        {users.length > 0 ? users.map((user) => (
          <Card key={user.id}
            size={{ base: 'xs', md: 'sm' }}
            variant={'infoCard'}>
            <CardBody>
              <CustomCardIcon icon={MdPerson} styleProps={{ marginRight: '4'}} />
              <Heading w='75%'
                fontSize={'md'}
                fontWeight={400}>{user.name}</Heading>
              {(group.createdById === sessionData?.user?.id ||
                user.id === sessionData?.user?.id) &&
                <VStack w='25%'>
                  <Button leftIcon={<MdPersonRemove />}
                    w='100%'
                    variant={'delete'}
                    onClick={onOpen}>
                    Remove
                  </Button>
                  <Confirm isOpen={isOpen} onClose={onClose} callback={() => {
                    onRemoveUser(user.id); onClose();
                  }} mode="removeUser" />
                </VStack>
              }
            </CardBody>
          </Card>
        )) : <Text>No members</Text>}
      </SimpleGrid>
  );
}