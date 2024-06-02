'use client'
import { useMemo } from 'react';
import NextLink from 'next/link'

import { Bar, ResponsiveContainer, BarChart, ReferenceLine } from 'recharts';

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


function formatBasedOnAmount({ amount, isColor, isType, isText }:
  { amount: number, isColor?: boolean, isType?: boolean, isText?: boolean }): string | undefined {
  const color = amount === 0 ? 'gray.500' : amount > 0 ? 'green.500' : 'red.500';
  const type = amount > 0 ? 'increase' : 'decrease';
  const text = amount === 0 ? 'All settled up!' : amount > 0 ? 'You get back' : 'You owe';

  if (isColor) return color;
  if (isType) return type;
  if (isText) return text;
  return undefined;
}


export default function DashboardView({ groups, transactions }: { groups: GroupDataWithAmountOwed[], transactions?: TransactionWithDetails[] }) {

  const totalAmountOwed = useMemo(() => groups.reduce((acc, group) => acc + group?.amountOwed!, 0), [groups])

  return (
    <VStack spacing={4} align="stretch">
      <HStack bg={'bgCard'} rounded={'lg'} w={'100%'}>
        <Stat variant={'primary'} w={'55%'} bg={'transparent'}>
          <StatLabel>Here&apos;s your balance</StatLabel>
          <StatNumber color={formatBasedOnAmount({ amount: totalAmountOwed, isColor: true })}>€{totalAmountOwed.toFixed(2)}</StatNumber>
          <StatHelpText>
            {totalAmountOwed !== 0 && <StatArrow type={formatBasedOnAmount({ amount: totalAmountOwed, isType: true })} />}
            {formatBasedOnAmount({ amount: totalAmountOwed, isText: true })}
          </StatHelpText>
        </Stat>
        <VStack w={'45%'}>
          {!!transactions && transactions.length > 0 &&
            <ResponsiveContainer width="100%" height={80}>
              <BarChart data={transactions}>
                <Bar dataKey="owe" stackId="a" fill="#992513" />
                <Bar dataKey="getBack" stackId="a" fill="#38A169" />
              </BarChart>
            </ResponsiveContainer>}
          <Text justifySelf={'end'} textAlign="right" fontSize="2xs" color="whiteAlpha.400" mt={1}>
            {transactions && transactions.length > 0 ? 'Last 2 weeks' : 'No activity'}
          </Text>
        </VStack>
      </HStack>
      <Divider />
      <SimpleGrid spacing={1} columns={2} >
        {!!groups && groups.length > 0 &&
          groups.map((group) => group && group.amountOwed !== 0 ?
            <Stat key={group.id}
              as={NextLink}
              href={`/transactions?id=${group.id}`}
              variant={'secondary'}>
              <StatLabel>{group.name}</StatLabel>
              <StatNumber color={group.amountOwed > 0 ? 'green.500' : 'red.500'}>€{group.amountOwed.toFixed(2)}</StatNumber>
              <StatHelpText>
                <StatArrow type={group.amountOwed > 0 ? 'increase' : 'decrease'} />
                {group.amountOwed > 0 ? 'You get back' : 'You owe'}</StatHelpText>
            </Stat> : <></>
          )}
      </SimpleGrid>
    </VStack>
  );
}