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

function AmountDisplay({ transactionDetails, userId }:
  { transactionDetails: TransactionWithDetails['transactionDetails'], userId: string }) {
  const amount = useMemo(() =>
    transactionDetails.find(td => td.userId === userId)?.amount as number
    , [transactionDetails, userId]);
  return (
    <VStack w={cardItemWidths['amount']} spacing={0} alignItems={'flex-end'}>
      <HStack>
        <Text color={amount >= 0 ? 'green.500' : 'red.500'}
          fontSize={'lg'} letterSpacing={'tight'}>
          {amount > 0 ? '+' : ''}{amount.toFixed(2)}</Text>
        <Text color={amount >= 0 ? 'green.500' : 'red.500'}>€</Text>
      </HStack>
      <Text fontSize={'2xs'}
        color={amount >= 0 ? 'green.400' : 'red.400'} opacity={0.65}
        fontWeight={'300'} letterSpacing={'tight'}>
        you {amount > 0 ? 'lent' : 'borrowed'}
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
