'use client'
import NextLink from 'next/link'
import { Bar, ResponsiveContainer, BarChart, YAxis, LineChart, Line, XAxis, Label } from 'recharts';

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
} from '@chakra-ui/react'
import { MdGroup } from 'react-icons/md';

import { BoxOutline } from '@/app/(site)/components/boxOutline';

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


function Statistic({ value, variant, statProps }:
  { value: number, variant?: string, statProps?: any }) {

  return (
    <Stat variant={variant ? variant : 'primary'} {...statProps}>
      <StatNumber color={formatBasedOnAmount({ amount: value, isColor: true })}>€{' '}{Math.abs(value).toFixed(2)}</StatNumber>
      <StatHelpText>
        {Math.abs(value) > 1e-2 && <StatArrow type={formatBasedOnAmount({ amount: value, isType: true })} />}
        {formatBasedOnAmount({ amount: value, isText: true })}
      </StatHelpText>
    </Stat>
  );
}


export default function DashboardView({ userGroupsBalance, activityHistory }:
  { userGroupsBalance: BalancesByUserGroups | undefined, activityHistory?: ActivityHistoryItem[] }) {
  const totalBalance: number = userGroupsBalance && Object.values(userGroupsBalance).reduce((acc: number, group) => acc + group.balance, 0) || 0;

  return (
    <Stack width={'100%'}>
      <BoxOutline >
        <Heading variant={'h1'}>Your balance</Heading>
        <Statistic value={totalBalance} variant={'primary'} />
        </BoxOutline>
      <BoxOutline>
        {!!activityHistory && activityHistory.length > 0 &&
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={activityHistory} margin={{ bottom: -12, left: 8 }}>
              <Bar dataKey="amount" fill='white' />
              <XAxis dataKey="paidAt" tick={{ fontSize: '8px', fill:'gray' }} tickLine={false} axisLine={false}/>
              <YAxis orientation={'left'} width={20}
                tick={{ fontSize: '10px',fill:'gray' }} tickLine={false} axisLine={false} />
            </BarChart>
          </ResponsiveContainer>}
      </BoxOutline>
      <Heading variant={'h3'}>Your groups</Heading>
      {userGroupsBalance &&
        <>
          <List variant={'groupBalances'}>
            {Object.entries(userGroupsBalance).map(([groupId, group]) =>
              <ListItem key={groupId}>
                <VStack width={'100%'}>
                <HStack width={'100%'} as={NextLink} href={`/groups/${groupId}/transactions`} justifyContent={'space-between'} textAlign={'end'}>
                  <Box marginRight={2} bg={'whiteAlpha.200'} boxSize={'43px'} rounded={'full'} alignContent={'center'} justifyContent={'center'} textAlign={'center'}>
                    <Icon as={MdGroup} color='whiteAlpha.800' paddingTop={1} boxSize={'20px'} />
                  </Box>
                  <Text width='50%' variant={'listPrimary'}>{group.groupName}</Text>
                  <Statistic value={group.balance} variant='secondary' />
                </HStack>
                <Divider />
                </VStack>
              </ListItem>
            )}
          </List>
        </>}
    </Stack>
  );
}