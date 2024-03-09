import NextLink from 'next/link'
import { useRouter } from 'next/navigation'

import {
  Card,
  CardBody,
  Heading,
  Text,
  Stack, Button, HStack,
  useDisclosure, SimpleGrid, VStack, ButtonGroup
} from '@chakra-ui/react'

import { MdPersonRemove, MdManageAccounts, MdGroups } from "react-icons/md"

import { type GroupData } from "@/app/_types/model/groups";
import { deleteGroup } from '@/app/(site)/groups/_lib/group-service';
import { CustomToast } from '@/app/_components/toast';
import { useSession } from 'next-auth/react';
import Confirm from '@/app/(site)/_components/confirm';
import { CustomCardIcon } from '@/app/(site)/_components/cardIcon';


export default function GroupsList(
  { groups, setGroups }:
    {
      groups: GroupData[],
      setGroups: React.Dispatch<React.SetStateAction<GroupData[]>>
    }) {
  const { data: sessionData } = useSession();
  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { addToast } = CustomToast();

  async function onRemoveGroup(id: string) {
    const res = await deleteGroup({ id: id, createdById: sessionData!.user.id })
    if (res.success) {
      const groupName = groups.find(g => g.id === id)?.name
      addToast(`Group ${groupName} removed`, null, 'success')
      setGroups(groups.filter(group => group.id !== id))
    }
    else {
      addToast('Cannot delete group.', res.error, 'error')
    }
  }

  return (
    <SimpleGrid spacing={1}>
      {!!groups &&
        groups.map((group) => (
          <Card key={group.id}
            size={{ base: 'xs', md: 'sm' }}
            variant={'infoCard'}>
            <CardBody>
              <CustomCardIcon icon={MdGroups} styleProps={{ marginRight: '4' }} />
              <Heading w='50%'
                as={NextLink}
                href={`/transactions?id=${group.id}`}
                fontSize={'md'} letterSpacing={'wide'}
                fontWeight={100}>{group.name}</Heading>
              {group.createdById === sessionData!.user.id &&
                <ButtonGroup w='50%'>
                  <Button leftIcon={<MdManageAccounts />}
                    w='100%'
                    variant="action"
                    onClick={() => router.push(
                      `/memberships?data=${JSON.stringify(group)}`,)}>
                    Manage
                  </Button>
                  <Button leftIcon={<MdPersonRemove />}
                    w='100%'
                    variant="delete"
                    onClick={onOpen}>
                    Remove
                  </Button>
                  <Confirm isOpen={isOpen} onClose={onClose} callback={() => {
                    onRemoveGroup(group.id); onClose();
                  }} mode="removeGroup" />
                </ButtonGroup>
              }
            </CardBody>
          </Card>
        ))}
    </SimpleGrid>
  )
}