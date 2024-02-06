import {
  Card,
  CardBody,
  Heading,
  Text,
  Stack, Button, VStack, HStack
} from '@chakra-ui/react'

import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { MdPersonRemove, MdManageAccounts } from "react-icons/md"

import { type GroupData } from "@/app/_types/model/groups";
import { deleteGroup } from '@/app/(site)/groups/_lib/group-service';
import { CustomToast } from '@/app/_components/toast';
import { useSession } from 'next-auth/react';


export default function GroupList(
  { groups, setGroups }:
    {
      groups: GroupData[],
      setGroups: React.Dispatch<React.SetStateAction<GroupData[]>>
    }) {
  const { data: sessionData } = useSession();
  const router = useRouter();
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
      {!!groups &&
        groups.map((group) => (
          <Card key={group.id}
            size='sm'
            variant={'custom'}>
            <CardBody>
              <HStack justifyContent={'center'}>
                <Heading as={NextLink}
                  ml={2}
                  w='50%'
                  href={`/groups/${group.id}`}
                  fontSize={'lg'}
                  fontWeight='400'>{group.name}</Heading>
                {group.createdById === sessionData!.user.id &&
                  <VStack w='50%' alignItems={'flex-end'}>
                    <Button leftIcon={<MdManageAccounts/>} size='sm'
                      variant={'outline'}
                      onClick={() => router.push(
                        `/memberships?data=${JSON.stringify(group)}`,)}>
                      Manage
                    </Button>
                    <Button leftIcon={<MdPersonRemove color='rgb(155,90,105)'/>} size='sm'
                      variant={'outline'}
                      onClick={() => onRemoveGroup(group.id)}>
                      Remove
                    </Button>
                  </VStack>}
              </HStack>
            </CardBody>
          </Card>
        ))}
    </Stack >
  )
}