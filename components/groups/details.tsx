'use client'
import {
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
}
  from "@chakra-ui/react";
import { type UserMembershipByGroup } from "@/types/model/memberships";
import { GroupData } from "@/types/model/groups";

type GroupDetailsProps = {
  group: GroupData,
  users: UserMembershipByGroup[]
}

export default function GroupDetails({ group, users }: GroupDetailsProps) {

  async function onDeleteGroup() {

  }

  return (
    <TableContainer mb={6} bg={'itemBgGray'} borderRadius={8}
      borderColor={'gray.700'}
      borderWidth={1}
      w='100%'>
      <Heading as='h2' size='md'
        fontWeight='400' p={4} borderBottomWidth={1}>{group.name}</Heading>
      <Table size='md' variant='unstyled'>
        <Thead>
          <Tr>
            <Th fontSize={'sm'} fontWeight={'400'}>Member</Th>
            <Th fontSize={'sm'} fontWeight={'400'}>Actions</Th>
          </Tr>
        </Thead>
        {users.length > 0 ? users.map((user) => (
          <Tbody key={user.id}>
            <Tr>
              <Td>{user.name}</Td>
              <Td>Remove</Td>
            </Tr>
          </Tbody>
        )) : <Tbody>
          <Tr>
            <Td>No users in this group</Td>
          </Tr>
        </Tbody>}
      </Table>
    </TableContainer>
  );
}