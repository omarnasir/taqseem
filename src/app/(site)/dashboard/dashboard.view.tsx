'use client'
import NextLink from 'next/link'
import { Bar, ResponsiveContainer, BarChart, YAxis } from 'recharts';

import {
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  VStack,
  HStack,
  List,
  ListItem,
  ListIcon,
  Divider,
  Icon,
  Box,
  Stack,
} from '@chakra-ui/react'

import { type BalancesByUserGroups } from "@/types/users.type";

import { type ActivityHistoryItem } from '@/types/activities.type';
import { MdGroup } from 'react-icons/md';

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
  { label: string, value: number, variant?: string, statProps?: any }) {

  return (
    <Stat variant={variant ? variant : 'primary'} {...statProps}>
      <StatLabel>{label}</StatLabel>
      <StatNumber color={formatBasedOnAmount({ amount: value, isColor: true })}>€{' '}{Math.abs(value).toFixed(2)}</StatNumber>
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
  const totalBalance : number = userGroupsBalance && Object.values(userGroupsBalance).reduce((acc: number, group) => acc + group.balance, 0) || 0;

  return (
    <VStack spacing={4} align="stretch">
      <HStack>
        <Statistic label={'Total Balance'} value={totalBalance} statProps={{ width: '55%' }} />
        <VStack w={'45%'}>
          {!!activityHistory && activityHistory.length > 0 &&
            <ResponsiveContainer width="100%" height={80}>
              <BarChart data={activityHistory}>
                <Bar dataKey="owe" stackId="a" fill="#38A169" />
                <Bar dataKey="getBack" stackId="a" fill="#992513" />
                <YAxis orientation={'right'} width={20} mirror={true} tick={{ fontSize: '8px' }} tickLine={true} axisLine={false} />
              </BarChart>
            </ResponsiveContainer>}
          <Text variant={'caption'}>
            {activityHistory && activityHistory.length > 0 ? 'Last 2 weeks' : 'No activity'}
          </Text>
        </VStack>
      </HStack>
      <Divider />
      <Text variant={'h2'}>Your Groups</Text>
      {userGroupsBalance &&
        <>
          <List variant={'groupBalances'}>
            {Object.entries(userGroupsBalance).map(([groupId, group]) =>
              <ListItem key={groupId}>
                <HStack width={'100%'} as={NextLink} href={`/groups/${groupId}/transactions`}>
                  <Box marginRight={2} bg={'bgListItem'} boxSize={'40px'} rounded={'lg'} alignContent={'center'} justifyContent={'center'} textAlign={'center'}>
                    <Icon as={MdGroup} color='whiteAlpha.800' paddingTop={1} boxSize={'20px'}/>
                  </Box>
                  <Text width={'50%'} variant={'listPrimary'}>{group.groupName}</Text>
                  <Statistic label={''} value={group.balance} variant={'secondary'} statProps={{ width: '40%' }}/>
                </HStack>
              </ListItem>
            )}
          </List>
        </>}
    </VStack>
  );
}