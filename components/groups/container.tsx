import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  Stack, StackDivider, Flex, Link
} from '@chakra-ui/react'

import NextLink from 'next/link'
import { MdGroup } from "react-icons/md"

import { type GroupData } from "@/types/model/groups";

export default function GroupContainer({ groups, title }:
  { groups: GroupData[], title: string }) {
  return (
    <Card mb={6}
      size='sm'
      variant={'outline'}
      bg={'black'}
      borderRadius={8}>
      <CardHeader>
        <Heading
          alignSelf={'flex-start'}
          size='md'
          fontWeight='400'>{title}</Heading>
      </CardHeader>
      <CardBody marginX={2}>
        <Stack divider={<StackDivider />} spacing='3'>
          {!!groups &&
            groups.map((group) => (
              <Flex flexDirection={'row'} key={group.id} alignItems={'center'}>
                <MdGroup />
                <Link as={NextLink}
                 href={{pathname: `/groups/details`, 
                 query: { id:group.id, name: group.name}}} 
                 ml={4}>
                  {group.name}
                </Link>
              </Flex>
            ))}
        </Stack>
      </CardBody>
    </Card>
  )
}