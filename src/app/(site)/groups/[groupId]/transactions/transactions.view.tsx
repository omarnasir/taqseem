'use client'
import React, { useState } from "react"
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';

import {
  VStack,
  HStack,
  Divider,
  Text,
  useDisclosure,
  ListItem,
  List,
  ListIcon,
  Flex,
  IconButton,
  Button,
} from "@chakra-ui/react"

import { getTransactionIcon } from "@/lib/db/constants";

import { type UserBasicData } from "@/types/users.type";
import { type TransactionWithDetails } from "@/types/transactions.type";
import { GroupWithMembers } from "@/types/groups.type"

import { type GroupedTransactions, type GetTransactionsResponse } from "@/types/transactions.type";

import { MdAdd } from "react-icons/md"

import { Transaction } from "./transaction"
import { useGetGroupTransactions } from "@/client/hooks/transactions.hook";


const cardItemWidths = {
  date: '7%',
  icon: '15%',
  desc: '53%',
  amount: '25%',
}

function DateDisplay({ paidAt }: { paidAt: TransactionWithDetails['paidAt'] }) {
  const date = new Date(paidAt).toLocaleDateString('en-gb', {
      day: '2-digit',
      month: 'short',
    });
  return (
    <VStack w={cardItemWidths['date']} spacing={0} fontSize={'xs'}>
      <Text color='whiteAlpha.700' >{date.split(' ')[1]}</Text>
      <Text color='whiteAlpha.700'>{date.split(' ')[0]}</Text>
    </VStack>
  )
}

function AmountDisplay({ transaction, userId }:
  { transaction: TransactionWithDetails, userId: string }) {
  const { amount: totalAmount, paidById, transactionDetails } = transaction;

  const amount = useMemo(() => {
    if (paidById === userId) {
      return totalAmount;
    }
    return transactionDetails.map((td) => {
      return td.userId === userId ? td.userId === paidById ? totalAmount - td.amount : -1 * td.amount : 0;
    }).reduce((acc, val) => acc + val, 0);
  }, [totalAmount, paidById, transactionDetails, userId]);


  const colorDarker = amount > 0 ? 'green.500' : amount < 0 ? 'red.500' : 'whiteAlpha.600';
  const colorLighter = amount > 0 ? 'green.400' : amount < 0 ? 'red.400' : 'whiteAlpha.600';

  return (
    <VStack w={cardItemWidths['amount']} spacing={0} alignItems={'flex-end'}>
      <HStack>
        <Text color={colorDarker}
          fontSize={'lg'} letterSpacing={'tight'}>{amount === 0 ? '' : amount > 0 ? `${amount.toFixed(1)} €` : `${(Math.abs(amount)).toFixed(1)} €`}</Text>
      </HStack>
      <Text fontSize={'2xs'}
        color={colorLighter} opacity={0.65}
        fontWeight={'300'} letterSpacing={'tight'}>
        {paidById === userId ? 'you lent' : amount === 0 ? 'not involved' : 'you borrowed'}
      </Text>
    </VStack>
  )
}

function SummaryDisplay({ transaction, users, userId }:
  { transaction: TransactionWithDetails, users: UserBasicData[], userId: string}) {
  const name = useMemo(() =>
    transaction.paidById === userId ? 'You' : users!.find(user => user.id === transaction.paidById)?.name 
    , [users, transaction.paidById, userId]);

  return (
    <VStack width={cardItemWidths['desc']} spacing={0} alignItems={'flex-start'}>
      <Text textAlign={'start'} letterSpacing={'normal'} fontSize={'md'} color='whiteAlpha.900' marginBottom={1}>
        {transaction.name}</Text>
      <Text color='whiteAlpha.600' textAlign={'start'} fontSize={'2xs'}>
        {name + ' paid ' + Math.abs(transaction.amount).toFixed(1) + ' €'}
      </Text>
    </VStack>
  )
}


function TransactionDisclosureWrapper({
  transactions, group, sessionData }:
  { transactions: GroupedTransactions, group: GroupWithMembers, sessionData: any
}) {
  const { isOpen, onClose, getDisclosureProps, getButtonProps } = useDisclosure();
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionWithDetails>();

  const { onClick, buttonProps } = getButtonProps();
  const disclosureProps = getDisclosureProps();

  return (
    <>
      <IconButton variant={'new'} size={'lg'}
        icon={<MdAdd />}
        onClick={() => { setSelectedTransaction(undefined); onClick() }}
        {...buttonProps}>new</IconButton>
      {transactions.map((yearData, index) => (
        <List w='100%' variant={'transaction'} key={index}>
          <Text textAlign={'center'} letterSpacing={'wide'} fontSize={'sm'} fontWeight={500} color={'whiteAlpha.800'} marginTop={3}>{yearData.year}</Text>
          {yearData.data.map((monthData, index) => (
            <div key={index}>
              <Text textAlign={'center'} letterSpacing={'wide'} fontSize={'xs'} fontWeight={300} color={'whiteAlpha.800'} marginY={3}>{monthData.monthName}</Text>
              {monthData.data.map((transaction) => (
                <ListItem w='100%' key={transaction.id}
                  flexDirection={'row'} display={'flex'} justifyContent={'space-between'}
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
          <Divider marginY={1} />
        </List >
        ))}
      {isOpen &&
        <Transaction
          {...{
            disclosureProps,
            isOpen, onCloseDrawer: onClose,
            group: group!,
            transactionWithDetails: selectedTransaction,
          }} />
      }
    </>
  )
}


export default function TransactionsView({ group, transactionsInitialData, sessionData }: 
  { group: GroupWithMembers, transactionsInitialData: GetTransactionsResponse, sessionData: any})
{
  const router = useRouter();
  
  const { transactions,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    fetchPreviousPage,
    hasPreviousPage,
    isFetchingPreviousPage
   } = useGetGroupTransactions(group.id, transactionsInitialData);

  return (
    <Flex w='100%' direction={'column'} paddingBottom={20} paddingTop={5}>
      <Text variant={'listHeading'}>{group?.name}</Text>
      <Button size='sm' variant={'settleGroup'} onClick={(e) => router.push(`/groups/${group.id}/settle`)}>Settle up</Button>
      <Divider />
      {hasPreviousPage &&
        <Button variant={'loadMore'}
          isDisabled={!hasPreviousPage}
          isLoading={isFetchingPreviousPage}
          onClick={() => fetchPreviousPage()}>Load Previous</Button>
      }
      <TransactionDisclosureWrapper transactions={transactions} group={group} sessionData={sessionData} />
      <Button variant={'loadMore'}
        isDisabled={!hasNextPage}
        isLoading={isFetchingNextPage}
        onClick={() => fetchNextPage()}>Load More</Button>
    </Flex>
  )
}