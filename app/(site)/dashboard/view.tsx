'use client'
import { useMemo } from 'react';
import NextLink from 'next/link'

import { LineChart, Line, Bar, ResponsiveContainer, BarChart, XAxis, ReferenceLine } from 'recharts';

import {
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  VStack,
  HStack,
  Divider,
} from '@chakra-ui/react'

import { type GroupDataWithAmountOwed } from "@/app/_service/groups";
import { TransactionWithDetails } from '@/app/_types/model/transactions';


export default function DashboardView({ groups, transactions }: { groups: GroupDataWithAmountOwed[], transactions?: TransactionWithDetails[]}) {

  const totalAmountOwed = useMemo(() => groups.reduce((acc, group) => acc + group.amountOwed, 0), [groups])

  return (
    <VStack spacing={4} align="stretch">
      <HStack>
      <Stat variant={'primary'} w={'55%'}>
        <StatLabel>Here&apos;s your balance</StatLabel>
        <StatNumber color={totalAmountOwed > 0 ? 'green.500' : 'red.500'}>€{totalAmountOwed.toFixed(2)}</StatNumber>
        <StatHelpText>
          <StatArrow type={totalAmountOwed > 0 ? 'increase' : 'decrease'} />
          {totalAmountOwed > 0 ? 'You get back' : 'You owe'}
        </StatHelpText>
        </Stat>
        {!!transactions && transactions.length > 0 ?
          <ResponsiveContainer width="45%" height={80}>
            {/* <LineChart data={transactions}>
              <Line type={"monotone"} dataKey="amount" stroke='white' strokeWidth={1} dot={false}/>
            </LineChart> */}
            <BarChart data={transactions}>
              <Bar dataKey="owe" stackId="a" fill="#992513" />
              <Bar dataKey="getBack" stackId="a" fill="#38A169" />
              <ReferenceLine x={0} stroke="#333" />
            </BarChart>
            <Text textAlign="center" fontSize="2xs" color="whiteAlpha.400" mt={1}>Last 2 weeks</Text>
          </ResponsiveContainer>
          : <div>No transactions in the last 14 days</div>}
      </HStack>
      <Divider  />
      <SimpleGrid spacing={1} columns={2} >
        {!!groups &&
          groups.map((group) => (
              <Stat key={group.id}
                as={NextLink}
                href={`/transactions?id=${group.id}`}
                variant={'secondary'}>
                <StatLabel>{group.name}</StatLabel>
                <StatNumber color={group.amountOwed > 0 ? 'green.500' : 'red.500'}>€{group.amountOwed.toFixed(2)}</StatNumber>
                <StatHelpText>
                  <StatArrow type={group.amountOwed > 0 ? 'increase' : 'decrease'} />
                  {group.amountOwed > 0 ? 'You get back' : 'You owe'}</StatHelpText>
              </Stat>
          ))}
      </SimpleGrid>
    </VStack>
  );
}