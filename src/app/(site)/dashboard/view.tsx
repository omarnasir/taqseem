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

import { type BalancesByUserGroups } from "@/types/users.type";

import { type ActivityHistoryItem } from '@/types/activities.type';

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


function Statistic({ label, value, variant, statProps }: 
  { label: string, value: number, variant?: string, statProps?: any}) {

  return (
    <Stat variant={variant ? variant : 'primary'} {...statProps}>
      <StatLabel>{label}</StatLabel>
      <StatNumber color={formatBasedOnAmount({ amount: value, isColor: true })}>€{Math.abs(value).toFixed(2)}</StatNumber>
      <StatHelpText>
        {Math.abs(value) > 1e-2 && <StatArrow type={formatBasedOnAmount({ amount: value, isType: true })} />}
        {formatBasedOnAmount({ amount: value, isText: true })}
      </StatHelpText>
    </Stat>
  );
}


export default function DashboardView({ userGroupsBalance, activityHistory }: 
  { userGroupsBalance: BalancesByUserGroups | undefined, activityHistory?: ActivityHistoryItem[] }) 
{
  const router = useRouter(); 
  const totalBalance : number = userGroupsBalance && Object.values(userGroupsBalance).reduce((acc: number, group) => acc + group.balance, 0) || 0;
  return (
    <VStack spacing={4} align="stretch">
      <HStack rounded={'lg'} w={'100%'} border={'1px'} borderColor={'whiteAlpha.200'} boxShadow={'md'}>
        <Statistic label={'Total Balance'} value={totalBalance} statProps={{ width: '55%' }} />
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

      {userGroupsBalance && 
        <>
          <Text fontSize="md" color="whiteAlpha.700">Your Groups</Text>
          <SimpleGrid spacing={2} columns={2}>
            {Object.entries(userGroupsBalance).map(([groupId, group]) =>
              <Card variant='summaryStat' size='sm' key={groupId}>
                <CardBody>
                  <NextLink href={`/groups/${groupId}/transactions`}>
                    <Statistic label={group.groupName} value={group.balance} variant={'secondary'} statProps={{ width: '100%' }} />
                  </NextLink>
                </CardBody>
                <CardFooter w='100%' justifyContent={'flex-end'} >
                  <Button size='sm' variant={'settle'}
                  isDisabled={Math.abs(group.balance) < 1e-2} disabled={Math.abs(group.balance) < 1e-2} onClick={(e) => router.push(`/groups/${groupId}/settle`)}>Settle up</Button>
                </CardFooter>
              </Card>
            )}
          </SimpleGrid>
        </>}
    </VStack>
  );
}