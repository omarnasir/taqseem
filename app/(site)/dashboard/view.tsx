'use client'
import { useMemo } from 'react';
import NextLink from 'next/link'

import { Bar, ResponsiveContainer, BarChart } from 'recharts';

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
  Button,
} from '@chakra-ui/react'

import { 
  FaRegHandshake as IconSettlement
 } from 'react-icons/fa6'

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
        <Stat variant={'primary'} w={'55%'}>
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
      {!!groups && groups.length > 0 &&
        groups.map((group) => group && group.amountOwed !== 0 ?
          <SimpleGrid spacing={1} columns={1} key={group.id}>
            <HStack bg={'bgCard'} rounded={'lg'} w={'100%'} >
              <Stat variant={'secondary'} as={NextLink} href={`/transactions?id=${group.id}`} w={'55%'}>
                <StatLabel>{group.name}</StatLabel>
                <StatNumber color={formatBasedOnAmount({ amount: group.amountOwed, isColor: true })}>€{group.amountOwed.toFixed(2)}</StatNumber>
                <StatHelpText>
                  {group.amountOwed !== 0 && <StatArrow type={formatBasedOnAmount({ amount: group.amountOwed, isType: true })} />}
                  {formatBasedOnAmount({ amount: group.amountOwed, isText: true })}
                </StatHelpText>
              </Stat>
              <Button w={'35%'} marginRight={4} size="sm" variant="login"
                leftIcon={<IconSettlement size={20} />}
              >Settle</Button>
            </HStack>
          </SimpleGrid> : null)}
    </VStack>
  );
}