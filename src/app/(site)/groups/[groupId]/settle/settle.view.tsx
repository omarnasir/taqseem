'use client';
import { useMemo } from 'react';

import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import {
  Text,
  HStack,
  VStack,
  Card,
  CardBody,
  CardHeader,
  IconButton,
  Skeleton,
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

import { GroupBalanceDetailsWithName } from "@/types/groups.type";

import { type SimplifiedBalances } from '@/types/groups.type';
import { SettleForm } from './settle-form';


function SimplifiedBalancesPopover({ settlementDetails }: { settlementDetails: SimplifiedBalances[] }) {

  return (
    <Popover placement='left' closeOnBlur={false}>
      <PopoverTrigger>
        <IconButton variant={'ghost'} size={'sm'} rounded={'full'} icon={<MdInfoIcon />} aria-label='Settlement details'
          position={'absolute'} right={1} top={1} zIndex={100} />
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
    <Skeleton isLoaded={groupBalanceDetails !== undefined}>
    <VStack spacing={4} align="stretch" paddingBottom={12}>
      <VStack paddingY={4} paddingX={1} rounded={'lg'} w={'100%'} border={'1px'} borderColor={'whiteAlpha.200'} boxShadow={'md'} align={'start'}>
        <Text paddingX={4} variant='h1'>{groupBalanceDetails.groupName}</Text>
        <Text paddingX={4} variant={'h2'}>Settlement Summary</Text>
        <ResponsiveContainer width={'100%'} height={chartData.length * 35}>
          <BarChart data={chartData} layout='vertical'>
            <Bar dataKey="balance" barSize={15} yAxisId={0}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.balance > 0 ? 'rgb(99, 255, 132)' : 'rgb(255, 99, 132)'} />
              ))}
            </Bar>
            <XAxis type="number" hide />
            <YAxis yAxisId={0} textAnchor="end" type="category" dataKey="userName" tickLine={false} axisLine={false} fontSize={12} tick={{ fill: 'white' }} />
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
      </VStack>
      {settlementDetails.length > 0 ? (
        <Card variant='summaryStat' size='sm'>
        <CardHeader>
          <Text fontSize="sm" color="whiteAlpha.900">Settlement Actions</Text>
          <Text variant={'settlementCaption'}>You can use the form below with simplified debts, or specify the amount to settle.</Text>
          <SimplifiedBalancesPopover settlementDetails={settlementDetails} />
        </CardHeader>
        <CardBody width='100%'>
          <SettleForm groupId={groupId} settlementDetails={settlementDetails} groupBalanceDetails={groupBalanceDetails} />
        </CardBody>
      </Card>
      ) : (
        <Text fontSize="sm" color="whiteAlpha.500">No debts to settle.</Text>
      )}
    </VStack>
    </Skeleton>
  )
}