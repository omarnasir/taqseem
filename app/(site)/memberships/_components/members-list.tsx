'use client'

import { useRouter } from "next/navigation";
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

import { deleteMembershipAction } from "../_lib/memberships-actions";
import { CustomToast } from "@/app/_components/toast";
import Confirm from "@/app/_components/confirm";
import { type UserBasicData } from "@/app/_types/model/users";
import { GroupData } from "@/app/_types/model/groups";
import { useSession } from "next-auth/react";
import { CustomCardIcon } from "@/app/_components/cardIcon";


export default function GroupMembersList({ group, users
}: { group: GroupData, users: UserBasicData[] }) {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { addToast } = CustomToast()

  async function onRemoveUser(userId: string) {
    const res = await deleteMembershipAction(group.id, userId)
    if (res.success) {
      addToast('User removed from group', null, 'success')
      router.refresh()
    }
    else {
      addToast('Error removing user from group', res.error, 'error')
    }
  }

  return (
      <SimpleGrid spacing={1}>
        {!!users ? users.map((user) => (
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