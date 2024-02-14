import {
  VStack,
  Text,
  HStack,
  Icon
} from '@chakra-ui/react'
import { MdEuroSymbol } from "react-icons/md"

import { type TransactionWithDetails } from "@/app/_types/model/transactions";
import { type UserBasicData } from "@/app/_types/model/users";

const cardItemWidths = {
  date: '10%',
  icon: '10%',
  desc: '50%',
  amount: '25%',
  delete: '5%',
}

function DateDisplay({ paidAt }: { paidAt: TransactionWithDetails['paidAt'] }) {
  const date = new Date(paidAt).toLocaleDateString('en-gb', {
    day: '2-digit',
    month: 'short',
  });
  return (
    <VStack w={cardItemWidths['date']} spacing={0}>
      <Text color={'#999999'} >{date.split(' ')[1]}</Text>
      <Text color={'#dedede'}>{date.split(' ')[0]}</Text>
    </VStack>
  )
}

function AmountDisplay({ transactionDetails, userId }:
  { transactionDetails: TransactionWithDetails['transactionDetails'], userId: string }) {
  const amount = transactionDetails.find(td => td.userId === userId)?.amount as number;
  return (
    <VStack w={cardItemWidths['amount']} spacing={0} alignItems={'flex-end'}>
      <HStack>
        <Text color={amount > 0 ? 'green.500' : 'red.500'}
          fontSize={'1.2rem'} fontWeight={'300'}>
          {amount > 0 ? '+' : ''}{amount.toFixed(2)}</Text>
        <Icon as={MdEuroSymbol} boxSize={'0.8em'}
          color={amount > 0 ? 'green.500' : 'red.500'} opacity={0.7}
        />
      </HStack>
      <Text fontSize={'0.65rem'}
        color={amount > 0 ? 'green.500' : 'red.500'} opacity={0.9}
        fontWeight={'200'}>
        you {amount > 0 ? 'lent' : 'borrowed'}
      </Text>
    </VStack>
  )
}

function SummaryDisplay({ transaction, users }:
  { transaction: TransactionWithDetails, users: UserBasicData[] }) {
  const name = users!.find(user => user.id === transaction.paidById)?.name;
  return (
    <VStack width={cardItemWidths['desc']} alignItems={'flex-start'} pl={2}>
      <Text textAlign={'start'}>{transaction.name}</Text>
      <Text color={'#808080'} textAlign={'start'} fontSize={'xs'}>
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
