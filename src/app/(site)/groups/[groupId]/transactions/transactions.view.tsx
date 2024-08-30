'use client'
import React, { useState } from "react"
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';

import {
  VStack,
  Divider,
  Text,
  useDisclosure,
  ListItem,
  List,
  ListIcon,
  Flex,
  IconButton,
  Button,
  Box,
  Heading,
  Container,
  Center,
} from "@chakra-ui/react"

import { getTransactionIcon } from "@/lib/db/constants";

import { type UserBasicData } from "@/types/users.type";
import { type TransactionWithDetails } from "@/types/transactions.type";
import { GroupWithMembers } from "@/types/groups.type"

import { type GetTransactionsResponse } from "@/types/transactions.type";

import { 
  MdAdd,
  MdOutlineHandshake as MdSettle,
 } from "react-icons/md"

import { Transaction } from "./transaction"
import { useGetGroupTransactions } from "@/client/hooks/transactions.hook";


const cardItemWidths = {
  date: '7%',
  icon: '13%',
  desc: '55%',
  amount: '25%',
}

function DateDisplay({ paidAt }: { paidAt: TransactionWithDetails['paidAt'] }) {
  const date = new Date(paidAt).toLocaleDateString('en-gb', {
    day: '2-digit',
    month: 'short',
  });
  return (
    <VStack w={cardItemWidths['date']} spacing={0}>
      <Text variant={'caption'}>{date.split(' ')[1]}</Text>
      <Text variant={'listSecondary'}>{date.split(' ')[0]}</Text>
    </VStack>
  )
}

function AmountDisplay({ transaction, userId }:
  { transaction: TransactionWithDetails, userId: string }) {
  const { amount: totalAmount, paidById, transactionDetails } = transaction;

  const amount =
    paidById === userId ? totalAmount
      : transactionDetails.map((td) => {
        return td.userId === userId ? td.userId === paidById ? totalAmount - td.amount : -1 * td.amount : 0;
      }).reduce((acc, val) => acc + val, 0);

  const color = (transaction.isSettlement || amount === 0) ? 'whiteAlpha.600' : paidById === userId ? 'lent' : 'borrowed';

  return (amount === 0 ?
    <Text w={cardItemWidths['amount']} color={color} variant={'listSupplementary'}>not involved</Text>
    :
    <Text w={cardItemWidths['amount']} variant={'listAmount'} color={color}>
      {'€ ' + (amount > 0 ? `${amount.toFixed(2)}` : `${(Math.abs(amount)).toFixed(2)}`)}
    </Text>
  )
}

function SummaryDisplay({ transaction, users, userId }:
  { transaction: TransactionWithDetails, users: UserBasicData[], userId: string }) {
  const name = useMemo(() =>
    transaction.paidById === userId ? 'You' : users!.find(user => user.id === transaction.paidById)?.name
    , [users, transaction.paidById, userId]);

  return (
    <VStack width={cardItemWidths['desc']} spacing={0} alignItems={'flex-start'}>
      <Text variant={'listPrimary'} >{transaction.name}</Text>
      <Text variant={'listSupplementary'} textAlign={'start'}>
        {name + ' paid ' + '€ ' + Math.abs(transaction.amount).toFixed(1)}
      </Text>
    </VStack>
  )
}


export default function TransactionsView({ group, transactionsInitialData, sessionData }:
  { group: GroupWithMembers, transactionsInitialData: GetTransactionsResponse, sessionData: any }) {
  const router = useRouter();

  const { isOpen, onClose, getDisclosureProps, getButtonProps } = useDisclosure();
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionWithDetails>();

  const { onClick, buttonProps } = getButtonProps();
  const disclosureProps = getDisclosureProps();

  const { transactions,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    fetchPreviousPage,
    hasPreviousPage,
    isFetchingPreviousPage
  } = useGetGroupTransactions(group.id, transactionsInitialData);

  return (
    <Flex w='100%' direction={'column'}>
      <Box height={'10vh'} position={'sticky'} top={0} zIndex={1} bg={'bgHeader'} />
      <Container textAlign={'center'} width={'100%'} marginBottom={'20vh'} paddingX={2}>
        <Box position={'sticky'} height={'10vh'} top={0} paddingY={4} zIndex={1} alignContent={'center'}>
          <Heading size={'h1Center'}>{group?.name}</Heading>
          <IconButton icon={<MdSettle/>} aria-label="Settle" boxSize={['2.5rem', '3.5rem']} rounded={'full'}
           variant={'settleGroup'} onClick={(e) => router.push(`/groups/${group.id}/settle`)}>Settle</IconButton>
        </Box>
        <Divider />
        {hasPreviousPage &&
          <Button variant={'loadMore'}
            isDisabled={!hasPreviousPage}
            isLoading={isFetchingPreviousPage}
            onClick={() => fetchPreviousPage()}>Load Previous</Button>
        }
        {transactions.map((yearData, index) => (
          <List w='100%' variant={'transaction'} key={index}>
            <Heading marginY={2} size={'h3'} textAlign={'center'}>{yearData.year}</Heading>
            {yearData.data.map((monthData, index) => (
              <div key={index}>
                <Heading size={'h4'} marginTop={4} textAlign={'center'}>{monthData.monthName}</Heading>
                {monthData.data.map((transaction) => (
                  <ListItem w='100%' key={transaction.id}
                    onClick={
                      () => {
                        setSelectedTransaction(transaction)
                        onClick();
                      }
                    }>
                    <DateDisplay paidAt={transaction.paidAt} />
                    <ListIcon as={getTransactionIcon(transaction.category)} width={cardItemWidths['icon']} h='5' color='whiteAlpha.700' />
                    <SummaryDisplay transaction={transaction} users={group?.users!} userId={sessionData?.user?.id!} />
                    <AmountDisplay transaction={transaction} userId={sessionData?.user?.id!} />
                  </ListItem>
                ))}
              </div>
            ))}
          </List >
        ))}
        <Button variant={'loadMore'}
          isDisabled={!hasNextPage}
          isLoading={isFetchingNextPage}
          onClick={() => fetchNextPage()}>Load More</Button>
        <Center bottom={0} zIndex={1}>
          <IconButton variant={'new'} size={'lg'}
            icon={<MdAdd />}
            onClick={() => { setSelectedTransaction(undefined); onClick() }}
            {...buttonProps}>new</IconButton>
        </Center>
      </Container>
      {isOpen &&
        <Transaction
          {...{
            disclosureProps,
            isOpen, onCloseDrawer: onClose,
            group: group!,
            transactionWithDetails: selectedTransaction,
          }} />
      }
    </Flex>
  )
}