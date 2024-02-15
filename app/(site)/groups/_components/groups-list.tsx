import NextLink from 'next/link'
import { useRouter } from 'next/navigation'

import {
  Card,
  CardBody,
  Heading,
  Text,
  Stack, Button, VStack, HStack, useDisclosure, SimpleGrid, Icon, CardFooter, Spacer, ButtonGroup
} from '@chakra-ui/react'

import { MdPersonRemove, MdManageAccounts, MdOutlineGroup } from "react-icons/md"

import { type GroupData } from "@/app/_types/model/groups";
import { deleteGroup } from '@/app/(site)/groups/_lib/group-service';
import { CustomToast } from '@/app/_components/toast';
import { useSession } from 'next-auth/react';
import Confirm from '@/app/(site)/_components/confirm';


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
      <Text fontSize='xl' fontWeight='bold'>Groups</Text>
      <Text size='sm' fontWeight='300'>Create or manage groups.</Text>
      <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(160px, 1fr))'>
        {!!groups &&
          groups.map((group) => (
            <Card key={group.id}
              size={{ base: 'md', md: 'lg' }}
              variant={'custom'}>
              <CardBody mt={2} as={NextLink} 
                href={`/transactions?id=${group.id}`}>
                <HStack justifyContent={'space-around'} w='100%'>
                  <Icon boxSize={5}
                    opacity={0.7}
                    as={MdOutlineGroup} />
                  <Heading w='70%'
                    size={'md'}
                    fontWeight='300'>{group.name}</Heading>
                </HStack>
              </CardBody>
              <CardFooter w='100%'>
                {group.createdById === sessionData!.user.id &&
                  <SimpleGrid spacing={4} w={'100%'}
                    templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}>
                    <Button leftIcon={<MdManageAccounts color='rgb(90, 105, 155)' />} size='sm'
                      fontWeight={400}
                      height={10}
                      onClick={() => router.push(
                        `/memberships?data=${JSON.stringify(group)}`,)}>
                      Manage
                    </Button>
                    <Button leftIcon={<MdPersonRemove color='rgb(155,90,105)' />} size='sm'
                      fontWeight={400}
                      height={10}
                      onClick={onOpen}>
                      Remove
                    </Button>
                    <Confirm isOpen={isOpen} onClose={onClose} callback={() => {
                      onRemoveGroup(group.id); onClose();
                    }} mode="removeGroup" />
                  </SimpleGrid>}
              </CardFooter>
            </Card>
          ))}
      </SimpleGrid>
    </Stack >
  )
}