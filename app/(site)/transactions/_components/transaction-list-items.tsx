'use client';
import { useMemo } from 'react';
import {
  VStack,
  Text,
  HStack,
} from '@chakra-ui/react'

import { type TransactionWithDetails } from "@/app/_types/model/transactions";
import { type UserBasicData } from "@/app/_types/model/users";

const cardItemWidths = {
  date: '7%',
  icon: '15%',
  desc: '53%',
  amount: '25%',
}

function DateDisplay({ paidAt }: { paidAt: TransactionWithDetails['paidAt'] }) {
  const date = useMemo(() => {
    return new Date(paidAt).toLocaleDateString('en-gb', {
      day: '2-digit',
      month: 'short',
    });
  }, [paidAt]);
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
    return transactionDetails.map((td) => {
      return td.userId === userId ? td.userId === paidById ? totalAmount - td.amount : -1 * td.amount : 0;
    }).reduce((acc, val) => acc + val, 0);
  }, [transactionDetails, userId, paidById, totalAmount]);


  const colorDarker = useMemo(() => amount === 0 ? 'whiteAlpha.500' : amount > 0 ? 'green.500' : 'red.500', [amount]);
  const colorLighter = useMemo(() => amount === 0 ? 'whiteAlpha.500' : amount > 0 ? 'green.400' : 'red.400', [amount]);

  return (
    <VStack w={cardItemWidths['amount']} spacing={0} alignItems={'flex-end'}>
      <HStack>
        <Text color={colorDarker}
          fontSize={'lg'} letterSpacing={'tight'}>
          {amount > 0 ? '+' : ''}{amount.toFixed(2)}</Text>
        <Text color={colorDarker}>€</Text>
      </HStack>
      <Text fontSize={'2xs'}
        color={colorLighter} opacity={0.65}
        fontWeight={'300'} letterSpacing={'tight'}>
        {amount === 0 ? '' : amount > 0 ? 'you lent' : 'you borrowed'}
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
      <Text textAlign={'start'} letterSpacing={'wide'} fontSize={'md'} color='whiteAlpha.900'>
        {transaction.name}</Text>
      <Text color='whiteAlpha.600' textAlign={'start'} fontSize={'2xs'}>
        {name + ' paid ' + transaction.amount + ' €'}
      </Text>
    </VStack>
  )
}


export {
  cardItemWidths,
  DateDisplay,
  AmountDisplay,
  SummaryDisplay
}
