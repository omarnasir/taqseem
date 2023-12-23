import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react'

import { type GroupData } from "@/types/groups";

export default function GroupsTable({ groups }: 
  { groups: GroupData[] })
{  
  return (
    <TableContainer mt={4} bg={'itemBgGray'} borderRadius={8}
      borderColor={'gray.700'}
      borderWidth={1}>
      <Table size='md' variant='unstyled'>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th isNumeric>No. of Members</Th>
          </Tr>
        </Thead>
        <Tbody>
          {!!groups &&
          groups.map((group) => (
            <Tr key={group.id}>
              <Td>{group.name}</Td>
              {/* <Td isNumeric>{group.users.length}</Td> */}
              <Td isNumeric>0</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}