'use client';
import { useMemo } from 'react';

import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import {
  Text,
  HStack,
  VStack,
  IconButton,
  Skeleton,
  Box,
  Heading,
} from '@chakra-ui/react'

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverCloseButton,
} from '@chakra-ui/react'

import { MdInfoOutline as MdInfoIcon,} from 'react-icons/md';

import { BoxOutline } from '@/app/(site)/components/boxOutline';
import { GroupBalanceDetailsWithName } from "@/types/groups.type";
import { type SimplifiedBalances } from '@/types/groups.type';
import { SettleForm } from './settle-form';


function SimplifiedBalancesPopover({ settlementDetails }: { settlementDetails: SimplifiedBalances[] }) {

  return (
    <Popover placement='left' closeOnBlur={false}>
      <PopoverTrigger>
        <IconButton variant={'ghost'} size={'md'} rounded={'full'} icon={<MdInfoIcon />} aria-label='Settlement details'
          zIndex={100}/>
      </PopoverTrigger>
      <PopoverContent color='white' bg='blackAlpha.900' border={'none'} boxShadow={'full'}>
        <PopoverHeader pt={4} fontWeight='normal' border='0'>
          Simplified Settlement Details
        </PopoverHeader>
        <PopoverCloseButton />
        <PopoverBody fontWeight={300} fontSize={'sm'} padding={4}>
          {settlementDetails.length > 0 && settlementDetails.map((settlement, index) => (
            <HStack key={index} padding={2}>
              <HStack>
                <Text variant={'settlementPayor'}>{settlement.payor.userName}</Text>
                <Text>owes</Text>
                <Text variant={'settlementPayee'}>{settlement.payee.userName}</Text>
              </HStack>
              <Text width={'30%'} variant={'settlementPayee'} >€{settlement.amount.toFixed(2)}</Text>
            </HStack>
          ))}
        </PopoverBody>

      </PopoverContent>
    </Popover>
  )
}


export function SettleView({ groupId, groupBalanceDetails, settlementDetails }:
  { groupId: string , groupBalanceDetails: GroupBalanceDetailsWithName, settlementDetails: SimplifiedBalances[] }) {

  const chartData = useMemo(() => {
    const balances = groupBalanceDetails.users.sort((a, b) => b.balance - a.balance);
    balances.map((user) => {
      user.balance = parseFloat(user.balance.toFixed(2));
      return user;
    });
    return balances;
  }, [groupBalanceDetails.users]);


  return (
    <VStack spacing={4} display={'flex'}>
      <BoxOutline>
        <Heading marginY={2} size='h2'>{groupBalanceDetails.groupName}</Heading>
        <Heading marginY={2} size={'h3'}>Settlement Summary</Heading>
        <ResponsiveContainer width={'100%'} height={chartData.length * 40}>
          <BarChart data={chartData} layout='vertical' margin={{left: -4}}>
            <Bar dataKey="balance" barSize={20} yAxisId={0}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.balance > 0 ? 'rgb(99, 255, 132)' : 'rgb(255, 99, 132)'} />
              ))}
            </Bar>
            <XAxis type="number" hide />
            <YAxis yAxisId={0} textAnchor="end" type="category" dataKey="userName" tickLine={false} axisLine={false} fontSize={12} tick={{ fill: 'white' }}/>
            <YAxis yAxisId={1} orientation='right' type="category" dataKey="balance" tickLine={false} axisLine={false}
              tick={(props) => {
                const { x, y, payload } = props;
                return (
                  <g transform={`translate(${x},${y})`}>
                    <text fontSize={12} x={0} y={0} dy={4}
                      fill={payload.value === 0 ? 'gray' : payload.value > 0 ? 'rgb(99, 255, 132)' : 'rgb(255, 99, 132)'}>
                      {payload.value.toFixed(2)} €
                    </text>
                  </g>
                );
              }
              } />
          </BarChart>
        </ResponsiveContainer>
      </BoxOutline>
      {settlementDetails.length > 0 ? (
        <Box marginTop={4}>
          <HStack justifyContent={'space-between'}>
            <VStack>
              <Heading alignSelf={'flex-start'} size={'h2'}>Settlement Actions</Heading>
              <Text variant={'settlementCaption'}>You can use the form below with simplified debts, or specify the amount to settle.</Text>
            </VStack>
            <SimplifiedBalancesPopover settlementDetails={settlementDetails} />
          </HStack>
          <SettleForm groupId={groupId} settlementDetails={settlementDetails} groupBalanceDetails={groupBalanceDetails} />
        </Box>
      ) : (
        <Text fontSize="sm" color="whiteAlpha.500">No debts to settle.</Text>
      )}
    </VStack>
  )
}