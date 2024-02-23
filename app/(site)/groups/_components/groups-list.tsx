import NextLink from 'next/link'
import { useRouter } from 'next/navigation'

import {
  Card,
  CardBody,
  Heading,
  Text,
  Stack, Button, HStack,
  useDisclosure, SimpleGrid, VStack
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
    <Stack direction={'column'} spacing={4}>
      <Text fontSize='lg' fontWeight='400'>Groups</Text>
      <Text fontSize='sm' fontWeight='300'>Create or manage groups.</Text>
      <SimpleGrid spacing={2}>
        {!!groups &&
          groups.map((group) => (
            <Card key={group.id}
              size={'xs'}
              variant={'infoCard'}>
              <CardBody>
                <HStack justifyContent={'space-between'} w='100%' >
                  <CustomCardIcon icon={MdGroups} styleProps={{marginX:'4'}}/>
                  <Heading w='40%'
                    as={NextLink}
                    href={`/transactions?id=${group.id}`}
                    fontSize={'lg'}
                    fontWeight={400}>{group.name}</Heading>
                  {group.createdById === sessionData!.user.id &&
                    <VStack w='30%'>
                      <Button leftIcon={<MdManageAccounts />}
                        w='100%'
                        fontSize={'sm'}
                        variant="action"
                        onClick={() => router.push(
                          `/memberships?data=${JSON.stringify(group)}`,)}>
                        Manage
                      </Button>
                      <Button leftIcon={<MdPersonRemove />}
                        w='100%'
                        variant="delete"
                        fontSize={'sm'}
                        onClick={onOpen}>
                        Remove
                      </Button>
                      <Confirm isOpen={isOpen} onClose={onClose} callback={() => {
                        onRemoveGroup(group.id); onClose();
                      }} mode="removeGroup" />
                    </VStack>
                  }
                </HStack>
              </CardBody>
            </Card>
          ))}
      </SimpleGrid>
    </Stack >
  )
}