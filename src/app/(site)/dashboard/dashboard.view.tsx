'use client'
import NextLink from 'next/link'
import { Bar, ResponsiveContainer, BarChart, YAxis, LineChart, Line, XAxis, Label, AreaChart, Area } from 'recharts';

import {
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  HStack,
  List,
  ListItem,
  Icon,
  Box,
  Stack,
  Divider,
  Heading,
  VStack,
  Flex,
  Skeleton,
} from '@chakra-ui/react'
import { MdGroup } from 'react-icons/md';

import { BoxOutline } from '@/app/(site)/components/boxOutline';

import { type BalancesByUserGroups } from "@/types/users.type";
import { type ActivityHistoryItem } from '@/types/activities.type';


function Statistic({ value, variant, statProps }:
  { value: number, variant?: string, statProps?: any }) {

  const isZero = Math.abs(value) < 1e-2;

  return (
    <Stat variant={variant ? variant : 'primary'} {...statProps}>
      <StatNumber color={isZero ? 'gray.500' : value > 0 ? 'green.400' : 'red.400'}>€{' '}{Math.abs(value).toFixed(2)}</StatNumber>
      <StatHelpText>
        {!isZero && <StatArrow type={value > 0 ? 'increase' : 'decrease'} />}
        {isZero ? 'All settled up!' : value > 0 ? 'You get back' : 'You owe'}
      </StatHelpText>
    </Stat>
  );
}


export default function DashboardView({ userGroupsBalance, activityHistory, user }:
  { userGroupsBalance: BalancesByUserGroups | undefined, activityHistory?: ActivityHistoryItem[], user: any }) {
  const totalBalance: number = userGroupsBalance && Object.values(userGroupsBalance).reduce((acc: number, group) => acc + group.balance, 0) || 0;

  const lastTenTransactions = activityHistory?.reduce((acc: number, item) => acc + item.amount, 0) || 0;

  return (
    <Stack width={'100%'} spacing={4}>
      <Box alignSelf={'start'} >
        <Heading variant={'h2'}>Hello, {user?.name}!</Heading>
        <Statistic value={totalBalance} variant={'primary'} />
      </Box>
      <Box paddingY={4}>
        <Skeleton isLoaded={!!activityHistory && activityHistory.length > 0} height={'200px'}>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={activityHistory} margin={{ bottom: -12, left: 8 }}>
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="white" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="white" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <Bar dataKey="amount" fill="url(#colorUv)" type={'basis'} strokeWidth={0} />
              <XAxis dataKey="paidAt" tick={{ fontSize: '9px', fill: 'gray' }} axisLine={false} />
              <YAxis orientation={'left'} width={20} tickCount={3}
                tick={{ fontSize: '9px', fill: 'gray' }} tickLine={false} axisLine={false} />
            </BarChart>
          </ResponsiveContainer>
          <HStack justify={'center'} marginTop={4} >
            <Text variant={'caption'}>last 10 transactions</Text>
            <Text variant={'caption'} color={lastTenTransactions > 0 ? 'lent' : 'borrowed'}>€{lastTenTransactions.toFixed(2)}</Text>
          </HStack>
        </Skeleton>
      </Box>
      <Heading variant={'h2'}>Your groups</Heading>
      <List variant={'groupBalances'}>
        {userGroupsBalance &&
          Object.entries(userGroupsBalance).map(([groupId, group]) =>
            <ListItem key={groupId}>
              <HStack width={'100%'} as={NextLink} href={`/groups/${groupId}/transactions`} justifyContent={'space-between'} textAlign={'end'}>
                <Box marginRight={2} bg={'whiteAlpha.200'} boxSize={'43px'} rounded={'full'} alignContent={'center'} justifyContent={'center'} textAlign={'center'}>
                  <Icon as={MdGroup} color='whiteAlpha.800' paddingTop={1} boxSize={'20px'} />
                </Box>
                <Heading width='50%' variant={'h3'} textAlign={'left'}>{group.groupName}</Heading>
                <Statistic value={group.balance} variant='secondary' />
              </HStack>
            </ListItem>
          )}
      </List>
    </Stack>
  );
}