import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  Stack, StackDivider, Flex, Link, Button
} from '@chakra-ui/react'

import NextLink from 'next/link'
import { MdGroup, MdPersonRemove } from "react-icons/md"

import { type GroupData } from "@/types/model/groups";
import { deleteGroup } from '@/client/services/group-service';
import { CustomToast } from '@/components/ui/toast';
import { useSession } from 'next-auth/react';


export default function GroupList(
  { groups, setGroups }:
    {
      groups: GroupData[],
      setGroups: React.Dispatch<React.SetStateAction<GroupData[]>>
    }) {
  const { data: sessionData } = useSession();
  const { addToast } = CustomToast();

  async function onRemoveGroup(groupId: string) {
    const res = await deleteGroup({ groupId: groupId, userId: sessionData!.user.id })
    if (res.success) {
      const groupName = groups.find(g => g.id === groupId)?.name
      addToast(`Group ${groupName} removed`, null, 'success')
      setGroups(groups.filter(group => group.id !== groupId))
    }
    else {
      addToast('Cannot delete group.', res.error, 'error')
    }
  }

  return (
    <Stack direction={'column'} spacing={4} w='inherit'>
      <Card mb={6}
        size='sm'
        variant={'outline'}
        bg={'itemBgGray'}
        borderRadius={8}>
        <CardHeader>
          <Heading
            alignSelf={'flex-start'}
            size='md'
            mb={1}
            fontWeight='400'>Your Groups</Heading>
          <Text size='sm' fontWeight='300'>Create or manage groups.</Text>
        </CardHeader>
        <CardBody marginX={2}>
          <Stack divider={<StackDivider />} spacing='3'>
            {!!groups &&
              groups.map((group) => (
                <Flex flexDirection={'row'} key={group.id} alignItems={'center'}
                  justifyContent={'space-between'}>
                  <Flex flexDirection={'row'} alignItems={'center'}>
                    <MdGroup />
                    <Link as={NextLink}
                      href={{
                        pathname: `/groups/details`,
                        query: { data: JSON.stringify(group) }
                      }}
                      ml={4} lineHeight={2}>
                      {group.name}
                    </Link>
                  </Flex>
                  {group.createdById === sessionData!.user.id &&
                    <Button leftIcon={<MdPersonRemove />} size='sm'
                      variant={'outline'} colorScheme={'red'}
                      onClick={() => onRemoveGroup(group.id)}>
                      Remove
                    </Button>}
                </Flex>
              ))}
          </Stack>
        </CardBody>
      </Card>
    </Stack>
  )
}