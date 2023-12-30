import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  Stack, StackDivider, Flex, Link, Button
} from '@chakra-ui/react'

import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { MdGroup, MdPersonRemove, MdManageAccounts } from "react-icons/md"

import { type GroupData } from "@/types/model/groups";
import { deleteGroup } from '@/client/services/group-service';
import { CustomToast } from '@/components/toast';
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
    <Stack direction={'column'} spacing={4} w='inherit'>
      <Card mb={6}
        p={1}
        size='sm'
        variant={'outline'}
        bg={'itemBgGray'}
        borderRadius={8}>
        <CardHeader>
          <Heading
            alignSelf={'flex-start'}
            size='md'
            mb={2}
            fontWeight='400'>Your Groups</Heading>
          <Text size='sm' fontWeight='300'>Create or manage groups.</Text>
        </CardHeader>
        <CardBody marginX={1}>
          <Stack divider={<StackDivider />} spacing='3'>
            {!!groups &&
              groups.map((group) => (
                <Flex flexDirection={'row'} key={group.id} alignItems={'center'}
                  justifyContent={'space-between'}>
                  <Flex flexDirection={'row'} alignItems={'center'}>
                    <MdGroup />
                    <Link as={NextLink}
                      href={`/groups/${group.id}?name=${group.name}`}
                      ml={3} lineHeight={2}>
                      {group.name}
                    </Link>
                  </Flex>
                  {group.createdById === sessionData!.user.id &&
                    <Flex>
                      <Button leftIcon={<MdManageAccounts />} size='sm' mr={1}
                        variant={'outline'} colorScheme={'blue'}
                        onClick={() => router.push(
                          `/memberships?data=${JSON.stringify(group)}`,)}>
                        Manage
                      </Button>
                      <Button leftIcon={<MdPersonRemove />} size='sm' ml={1}
                        variant={'outline'} colorScheme={'red'}
                        onClick={() => onRemoveGroup(group.id)}>
                        Remove
                      </Button>
                    </Flex>}
                </Flex>
              ))}
          </Stack>
        </CardBody>
      </Card>
    </Stack>
  )
}