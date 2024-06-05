'use client';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Text,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Divider,
  VStack,
} from '@chakra-ui/react'

import {
  FaRegHandshake as IconSettlement
} from 'react-icons/fa6'

import {
  type MemberBalanceByGroups
} from "@/app/_service/groups";


function formatBasedOnAmount({ amount, isColor, isText }:
  { amount: number, isColor?: boolean, isText?: boolean }): string | undefined {
  const color = amount === 0 ? 'whiteAlpha.400' : amount > 0 ? 'green.500' : 'red.500';
  const text = amount === 0 ? 'is settled up' : amount > 0 ? 'gets back' : 'owes';

  if (isColor) return color;
  if (isText) return text;
  return undefined;
}

export function SettlementModal({ group }: { group: MemberBalanceByGroups[string] }) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button onClick={onOpen} size="md" w='60%' variant="settle" leftIcon={<IconSettlement size={14} />}>Settle</Button>

      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'sm', md: 'md' }} variant={'transaction'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Settle up</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize={'lg'} fontWeight={300}>{group.groupName}</Text>
            <Divider my={2} />
            <TableContainer>
              <Table variant='simple' size={'sm'}>
                <TableCaption>Settlement summary</TableCaption>
                <Tbody>
                  {group.users.map((user) => (
                    <Tr key={user.userId}>
                      <Td fontWeight={600} color={formatBasedOnAmount({ amount: user.balance, isColor: true })}>{user.userName}</Td>
                      <Td color={formatBasedOnAmount({ amount: user.balance, isColor: true })}>{formatBasedOnAmount({ amount: user.balance, isText: true })}</Td>
                      <Td color={formatBasedOnAmount({ amount: user.balance, isColor: true })} isNumeric>{user.balance === null || 0 ? '0.00' : Math.abs(user.balance).toFixed(2)}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              {/* <Divider my={2} />
              <TableContainer>
                <Table variant='simple' size={'sm'}>
                  <TableCaption>Simplified Debts</TableCaption>
                  <Tbody>
                    {settlementDetails.map((data) => (
                      data.balance && data.balance !== 0 ?
                        <Tr key={data.userId}>
                          <Td>{data.name}</Td>
                          <Td color={data.balance < 0 ? 'red.400' : 'green.400'} isNumeric>{data.balance < 0 ? 'owes' : 'gets back'} €{Math.abs(data.balance).toFixed(2)}</Td>
                        </Tr> : null
                    ))}
                  </Tbody>
                </Table>
              </TableContainer> */}
            </TableContainer>
          </ModalBody>

          <ModalFooter>
            <Button w='25%' variant='formNavigation' mr={2} onClick={onClose}>
              Close
            </Button>
            <Button w='25%' variant='settle' onClick={onClose}>
              Settle
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}