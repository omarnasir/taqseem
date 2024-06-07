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
  Tbody,
  Tr,
  Td,
  TableCaption,
  TableContainer,
  Divider,
  Thead,
  HStack,
} from '@chakra-ui/react'

import {
  FaRegHandshake as IconSettlement
} from 'react-icons/fa6'

import {
  type MemberBalanceByGroups
} from "@/app/_service/groups";
import { useEffect, useMemo, useState } from 'react';


type SimplifiedBalances = {
  payor: string[],
  payee: string,
  amount: number
}


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

  const [settlementDetails, setSettlementDetails] = useState<SimplifiedBalances[]>([]);

  useEffect(() => {
    // Simplify the balances. If 1 user owes money to more than 1 user, the balance is the sum of all the debts
    const balances : SimplifiedBalances[] = [];
    // find all users with debts and sort them
    const debts = structuredClone(group.users.filter(user => user.balance < 0).sort((a, b) => a.balance - b.balance))
    // find all users with credits and sort them
    const credits = structuredClone(group.users.filter(user => user.balance > 0).sort((a, b) => b.balance - a.balance))
    // take the first user with the highest debt, and the first user with the highest credit
    // if the debt is higher than the credit, the credit is settled and the debt is reduced by the credit amount
    // if the credit is higher than the debt, the debt is settled and the credit is reduced by the debt amount
    // if the credit is equal to the debt, both are settled
    while (debts.length > 0) {
      const debt = debts[0];
      const credit = credits[0];
      const amount = Math.min(Math.abs(debt.balance), credit.balance);
      balances.push({ payor: [debt.userName], payee: credit.userName, amount });
      debt.balance += amount;
      credit.balance -= amount;
      if (debt.balance === 0) debts.shift();
      if (credit.balance === 0) credits.shift();
    }

    // the balances are simplified and stored in the state
    setSettlementDetails(balances);
  }
  , [group.users]);


  return (
    <>
      <Button onClick={onOpen} variant="settle">Settle</Button>

      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'sm', md: 'md' }} variant={'transaction'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Settle up</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize={'lg'} fontWeight={300}>{group.groupName}</Text>

            <TableContainer marginY={6}>
              <Text fontSize={'sm'}  borderBottom={'1px solid'} borderColor={'whiteAlpha.300'}>Settlement Summary</Text>
              <Table variant='unstyled' size={'sm'}>
                <Tbody>
                  {group.users.map((user) => (
                    <Tr key={user.userId}>
                      <Td fontWeight={600} color={formatBasedOnAmount({ amount: user.balance, isColor: true })}>{user.userName}</Td>
                      <Td >{formatBasedOnAmount({ amount: user.balance, isText: true })}</Td>
                      <Td color={formatBasedOnAmount({ amount: user.balance, isColor: true })} isNumeric>{user.balance === null || 0 ? '0.00' : Math.abs(user.balance).toFixed(2)}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>

            <TableContainer>
              <Text fontSize={'sm'} borderBottom={'1px solid'} borderColor={'whiteAlpha.300'}>Simplified Debts</Text>
              <Table variant='unstyled' size={'sm'} marginTop={2}>
                <Tbody>
                  {settlementDetails.length > 0 && settlementDetails.map((settlement, index) => (
                    <Tr key={index}>
                      <Td>
                        <HStack> 
                        <Text fontWeight={500} color={'red.500'}>{settlement.payor.join(', ')}</Text>
                        <Text>pays</Text>
                        <Text color={'green.500'}>{settlement.payee}</Text>
                        </HStack>
                        </Td>
                      <Td color={'green.500'} isNumeric>{settlement.amount.toFixed(2)}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
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