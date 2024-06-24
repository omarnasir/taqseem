'use client'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
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
  Card,
  CardFooter,
  CardBody,
  Button,

} from '@chakra-ui/react'

import { type BalancesByUserGroups } from "@/app/_service/groups";

import { type Activity } from '@/app/_service/transactions';

function formatBasedOnAmount({ amount, isColor, isType, isText }:
  { amount: number, isColor?: boolean, isType?: boolean, isText?: boolean }): string | undefined {
  const color = Math.abs(amount) < 1e-2 ? 'gray.500' : amount > 0 ? 'green.400' : 'red.400';
  const type = amount > 0 ? 'increase' : 'decrease';
  const text = Math.abs(amount) < 1e-2 ? 'All settled up!' : amount > 0 ? 'You get back' : 'You owe';

  if (isColor) return color;
  if (isType) return type;
  if (isText) return text;
  return undefined;
}

export default function DashboardView({ userGroupsBalance, activityHistory, totalBalance }: 
  { userGroupsBalance: BalancesByUserGroups | {}, activityHistory?: Activity[], totalBalance: number}) 
{
  const router = useRouter();
  return (
    <VStack spacing={4} align="stretch">
      <HStack rounded={'lg'} w={'100%'} border={'1px'} borderColor={'whiteAlpha.200'} boxShadow={'md'}>
        <Stat variant={'primary'} w={'55%'}>
          <StatLabel>Here&apos;s your balance</StatLabel>
          <StatNumber color={formatBasedOnAmount({ amount: totalBalance, isColor: true })}>€{Math.abs(totalBalance).toFixed(2)}</StatNumber>
          <StatHelpText>
            {Math.abs(totalBalance) > 1e-2 && <StatArrow type={formatBasedOnAmount({ amount: totalBalance, isType: true })} />}
            {formatBasedOnAmount({ amount: totalBalance, isText: true })}
          </StatHelpText>
        </Stat>
        <VStack w={'45%'}>
          {!!activityHistory && activityHistory.length > 0 &&
            <ResponsiveContainer width="100%" height={80}>
              <BarChart data={activityHistory}>
                <Bar dataKey="owe" stackId="a" fill="#38A169" />
                <Bar dataKey="getBack" stackId="a" fill="#992513" />
                <ReferenceLine y={0} stroke="#434343" />
              </BarChart>
            </ResponsiveContainer>}
          <Text justifySelf={'end'} textAlign="right" fontSize="2xs" color="whiteAlpha.400">
            {activityHistory && activityHistory.length > 0 ? 'Last 2 weeks' : 'No activity'}
          </Text>
        </VStack>
      </HStack>

      {Object.keys(userGroupsBalance).length !== 0 ?
        <>
          <Text fontSize="sm" color="whiteAlpha.400">Your Groups</Text>
          <SimpleGrid spacing={2} columns={2}>
            {Object.entries(userGroupsBalance).map(([groupId, group]) =>
              <Card variant='summaryStat' size='sm' key={groupId}>
                <CardBody>
                  <Stat variant={'secondary'} as={NextLink} href={`/groups/${groupId}/transactions`} w='100%'>
                    <StatLabel>{group.groupName}</StatLabel>
                    <StatNumber color={formatBasedOnAmount({ amount: group.balance, isColor: true })}>€{Math.abs(group.balance).toFixed(2)}</StatNumber>
                    <StatHelpText>
                      {Math.abs(group.balance) > 1e-2 && <StatArrow type={formatBasedOnAmount({ amount: group.balance, isType: true })} />}
                      {formatBasedOnAmount({ amount: group.balance, isText: true })}
                    </StatHelpText>
                  </Stat>
                </CardBody>
                <CardFooter w='100%' justifyContent={'flex-end'} >
                  <Button size='sm' variant={'settle'}
                  isDisabled={group.balance < 1e-2} disabled={group.balance < 1e-2} onClick={(e) => router.push(`/groups/${groupId}/settle`)}>Settle up</Button>
                </CardFooter>
              </Card>
            )}
          </SimpleGrid>
        </> : null}
    </VStack>
  );
}