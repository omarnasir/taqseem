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
  Flex,
} from '@chakra-ui/react'

import { type MemberBalanceByGroups } from "@/app/_service/groups";

import { type Activity } from '@/app/_service/transactions';
import { SettlementModal } from '@/app/(site)/_components/settle';


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

export default function DashboardView({ groupsBalance, activityHistory, sessionData }: 
  { groupsBalance: MemberBalanceByGroups | {}, activityHistory?: Activity[], sessionData: any}) 
{

  const amountOwedByGroup = useMemo(() => {
    return Object.entries(groupsBalance).map(([groupId, group]) => {
      return {
        groupId,
        groupName: group.groupName,
        balance: group.users.filter(user => user.userId === sessionData?.user?.id)?.[0]?.balance || 0
      };
    })
  } , [groupsBalance, sessionData?.user?.id]);

  const totalBalance = amountOwedByGroup.reduce((acc, group) => acc + group.balance, 0);

  return (
    <VStack spacing={4} align="stretch">
      <HStack bg={'bgCard'} rounded={'lg'} w={'100%'}>
        <Stat variant={'primary'} w={'55%'}>
          <StatLabel>Here&apos;s your balance</StatLabel>
          <StatNumber color={formatBasedOnAmount({ amount: totalBalance, isColor: true })}>€{Math.abs(totalBalance).toFixed(2)}</StatNumber>
          <StatHelpText>
            {totalBalance !== 0 && <StatArrow type={formatBasedOnAmount({ amount: totalBalance, isType: true })} />}
            {formatBasedOnAmount({ amount: totalBalance, isText: true })}
          </StatHelpText>
        </Stat>
        <VStack w={'45%'}>
          {!!activityHistory && activityHistory.length > 0 &&
            <ResponsiveContainer width="100%" height={80}>
              <BarChart data={activityHistory}>
                <Bar dataKey="owe" stackId="a" fill="#992513" />
                <Bar dataKey="getBack" stackId="a" fill="#38A169" />
              </BarChart>
            </ResponsiveContainer>}
          <Text justifySelf={'end'} textAlign="right" fontSize="2xs" color="whiteAlpha.400" mt={1}>
            {activityHistory && activityHistory.length > 0 ? 'Last 2 weeks' : 'No activity'}
          </Text>
        </VStack>
      </HStack>
      <Divider />
      {Object.keys(groupsBalance).length !== 0 ?
        <>
          <Text fontSize="sm" color="whiteAlpha.400">Your Groups</Text>
          <SimpleGrid spacing={1} columns={2}>
            {amountOwedByGroup.map(group =>
              <VStack bg={'bgCard'} rounded={'lg'} w={'100%'} key={group.groupId}>
                <Stat variant={'secondary'} as={NextLink} href={`/groups/${group.groupId}/transactions`} w='100%'>
                  <StatLabel>{group.groupName}</StatLabel>
                  <StatNumber color={formatBasedOnAmount({ amount: group.balance, isColor: true })}>€{Math.abs(group.balance).toFixed(2)}</StatNumber>
                  <StatHelpText>
                    {group.balance !== 0 && <StatArrow type={formatBasedOnAmount({ amount: group.balance, isType: true })} />}
                    {formatBasedOnAmount({ amount: group.balance, isText: true })}
                  </StatHelpText>
                  <Divider />
                </Stat>
                <Flex marginBottom={2} marginRight={4} w='100%' justifyContent={'flex-end'} >
                  <SettlementModal group={groupsBalance[group.groupId]} />
                </Flex>
              </VStack>
            )}
          </SimpleGrid>
        </> : null}
    </VStack>
  );
}