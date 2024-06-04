"use client"
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'

import {
  Card,
  CardBody,
  Heading,
  Button, 
  useDisclosure, SimpleGrid, ButtonGroup
} from '@chakra-ui/react'

import { MdPersonRemove, MdManageAccounts, MdGroups } from "react-icons/md"

import { type GroupData } from "@/app/_types/model/groups";
import { deleteGroupAction } from '@/app/_actions/groups';
import { CustomToast } from '@/app/_components/toast';
import { useSession } from 'next-auth/react';
import Confirm from '@/app/(site)/_components/confirm';
import { CustomCardIcon } from '@/app/(site)/_components/cardIcon';


export default function GroupsList(
  { groups }: { groups: GroupData[] }) 
{
  const { data: sessionData } = useSession();
  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { addToast } = CustomToast();

  async function onRemoveGroup(id: string) {
    const res = await deleteGroupAction(id);
    if (res.success) {
      const groupName = groups.find(g => g.id === id)?.name
      addToast(`Group ${groupName} removed`, null, 'success')
      router.refresh()
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
              {group.createdById === sessionData?.user?.id &&
                <ButtonGroup w='50%'>
                  <Button leftIcon={<MdManageAccounts />}
                    w='100%'
                    variant="action"
                    onClick={() => router.push(
                      `/groups/memberships?data=${JSON.stringify(group)}`,)}>
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