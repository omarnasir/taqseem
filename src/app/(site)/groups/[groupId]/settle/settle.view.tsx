'use client';
import { useMemo } from 'react';
import { useSessionHook } from '@/client/hooks/session.hook';

import { useRouter } from 'next/navigation';
import { Controller, FormProvider, useFieldArray, useForm, useWatch } from 'react-hook-form';

import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import {
  Text,
  HStack,
  VStack,
  Checkbox,
  FormControl,
  FormErrorMessage,
  InputGroup,
  NumberInput,
  NumberInputField,
  Button,
  Card,
  CardBody,
  CardHeader,
  InputLeftElement,
  Select,
  Divider,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react'

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverCloseButton,
} from '@chakra-ui/react'

import { MdEuroSymbol,
  MdAdd as MdAddIcon,
  MdDelete as MdDeleteIcon,
  MdInfoOutline as MdInfoIcon,
  MdLockReset as MdResetIcon,
 } from 'react-icons/md';

import {
  GroupBalanceDetailsWithName,
  type GroupBalanceDetails
} from "@/types/groups.type";

import { type CreateTransaction } from "@/types/transactions.type";
import { createTransactionAction } from '@/server/actions/transactions.action';
import { Confirm } from '@/app/(site)/components/confirm';

import { type SimplifiedBalances } from '@/types/groups.type';

type SettlementForm = {
  data: {
    amount: string,
    paidById: string,
    paidforId: string,
  }[]
}

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
                <Text fontWeight={500} color={'red.500'}>{settlement.payor.userName}</Text>
                <Text>owes</Text>
                <Text color={'green.500'}>{settlement.payee.userName}</Text>
              </HStack>
              <Text width={'30%'} color={'green.500'} >€{settlement.amount.toFixed(2)}</Text>
            </HStack>
          ))}
        </PopoverBody>

      </PopoverContent>
    </Popover>
  )
}

function SettleForm({ groupId , settlementDetails, groupBalanceDetails }:
  { groupId: string , settlementDetails: SimplifiedBalances[] , groupBalanceDetails: GroupBalanceDetails }) {

  const { session, status } = useSessionHook();
  const router = useRouter();
  const methods = useForm<SettlementForm>({
    defaultValues:  {
      data:
      settlementDetails.map((settlement) => ({
        amount: settlement.amount.toString(),
        paidById: settlement.payor.userId,
        paidforId: settlement.payee.userId,
      }))
    }
  });

  const {
    control,
    register,
    handleSubmit,
    clearErrors,
    getFieldState,
    formState: { isDirty, isValid }
  } = methods;

  const { fields, update, append, remove } = useFieldArray({
    control,
    name: 'data'
  })

  const data = useWatch({
    control,
    name: 'data',
  });

  async function onSubmit(data: SettlementForm) {
    const transactions : CreateTransaction[] = data.data.map((settlement) => ({
      groupId: groupId,
      amount: parseFloat(settlement.amount),
      paidById: settlement.paidById,
      name: 'Settlement',
      category: -1,
      subCategory: -1,
      createdById: session?.user?.id as string,
      createdAt: new Date().toISOString(),
      isSettlement: true,
      paidAt: new Date().toISOString(),
      transactionDetails: 
      groupBalanceDetails.users.filter((user) => user.userId === settlement.paidById).map((user) => {
        return {
          userId: user.userId,
          amount: parseFloat(settlement.amount),
        }
      })
    }));
    await Promise.all(transactions.map((transaction) => createTransactionAction(groupId, transaction))).then(() => {
      router.push(`/groups/${groupId}/transactions`);
    });
  };

  return (status === 'authenticated' &&
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <HStack spacing={1} align="stretch"  w={'100%'} justify={'space-between'}
        borderBottom={'1px'} borderColor={'whiteAlpha.200'}
        fontSize={'xs'} color={'whiteAlpha.500'} fontWeight={500} paddingY={2}>
          <Text>Who pays?</Text>
          <Text>How much?</Text>
          <Text>Who gets?</Text>
        </HStack>
        {fields.map((field, index) => (
          <FormControl id={'data'} key={index} isInvalid={getFieldState(`data.${index}`).invalid}>
            <HStack spacing={2} w={'100%'} justify={'space-between'}>
              <Checkbox onChange={(e) => {
                if (!e.target.checked) update(index, { ...field, amount: '' })
                else update(index, { ...field, amount: '0' })
              }}
                variant={'settlement'}
                defaultChecked={true}
                rounded='full'
                size={'sm'}>
              </Checkbox>
              <Select variant='settlement' size={'xs'}
                {...register(`data.${index}.paidById` as const)}
                defaultValue={field.paidById}>
                {groupBalanceDetails.users.map((user) => (
                  <option key={user.userId} value={user.userId}>{user.userName}</option>
                ))}
              </Select>
              <InputGroup variant={"settlement"}>
                <InputLeftElement marginLeft={-2} marginTop={-1} alignContent={'center'} >
                  <MdEuroSymbol  size={'0.75rem'} color='gray'/>
                </InputLeftElement>
                <Controller
                  name={`data.${index}.amount`}
                  control={control}
                  render={({ field: { ref, name, onChange, ...restField } }) => (
                    <NumberInput size={'sm'} variant={'settlement'}
                      {...restField}
                      onChange={(value) => {
                        getFieldState(`data.${index}.amount`).invalid && clearErrors(`data.${index}.amount`)
                        onChange(value)
                      }}
                      isValidCharacter={(char) => {
                        return (char >= '0' && char <= '9') || char === '.' || char === ','
                      }}
                      pattern={'[0-9]+([,.][0-9]+)?'}
                      parse={(value) => {
                        return value.replace(',', '.')
                      }}
                      format={(value) => {
                        // Count precision
                        const [val, precision] = value.toString().split('.')
                        if (precision && precision.length > 2) {
                          return val + ',' + precision.slice(0, 2)
                        }
                        return value.toString().replace('.', ',')
                      }}
                    >
                      <NumberInputField
                        ref={ref}
                        name={name}
                        placeholder={'0,0'}
                        textIndent={'0.5rem'}
                      />
                    </NumberInput>)} />
              </InputGroup>
              <Select variant='settlement' size={'xs'}
                {...register(`data.${index}.paidforId` as const)}
                defaultValue={field.paidforId}>
                {groupBalanceDetails.users.map((user) => (
                  data[index] ? data[index].paidById !== user.userId &&
                    <option key={user.userId} value={user.userId}>{user.userName}</option>
                    : <option key={user.userId} value={user.userId}>{user.userName}</option>
                ))}
              </Select>
            </HStack>
          </FormControl>
        ))}
        <Divider />
        <HStack justifyContent={'space-between'} padding={1}>
          <HStack spacing={2} w={'20%'}>
          <IconButton variant={'outline'} size={'sm'} rounded={'full'} width={'10%'}  icon={<MdAddIcon />} aria-label='Add new settlement'
          onClick={() => 
            append({ amount: '0', paidById: groupBalanceDetails.users[0].userId, paidforId: groupBalanceDetails.users[1].userId })
          } marginTop={2} />
          <IconButton variant={'outline'} size={'sm'} rounded={'full'} width={'10%'} icon={<MdDeleteIcon />} aria-label='Delete last settlement'
          onClick={() => 
            remove(fields.length - 1)
          } marginTop={2} />
          <IconButton variant={'outline'} size={'sm'} rounded={'full'} width={'10%'} icon={<MdResetIcon />} aria-label='Reset all settlements'
          onClick={() => 
            { 
              remove();
              settlementDetails.map((settlement) => {
                append({
                  amount: settlement.amount.toString(),
                  paidById: settlement.payor.userId,
                  paidforId: settlement.payee.userId,
                })
              })
            }
          } marginTop={2} />
          </HStack>
          <HStack spacing={2} w={'80%'} justifyContent={'flex-end'}>
            <Confirm callback={() => {
              handleSubmit(onSubmit)();
            }} mode="settlement">
              <Button variant={'settle'} size={'sm'} w={'40%'} disabled={!isDirty || !isValid} marginTop={2}>Settle</Button>
            </Confirm>
          </HStack>
        </HStack>
          <FormErrorMessage>
            {getFieldState('data').error?.message?.toString()}
          </FormErrorMessage>
      </form>
    </FormProvider>
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
    <VStack spacing={4} align="stretch" paddingBottom={12}>
      <VStack paddingY={4} paddingX={1} rounded={'lg'} w={'100%'} border={'1px'} borderColor={'whiteAlpha.200'} boxShadow={'md'} align={'start'}>
        <Text paddingX={4} fontSize={'xl'} fontWeight={500}>{groupBalanceDetails.groupName}</Text>
        <Text paddingX={4} fontSize={'sm'}>Settlement Summary</Text>
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
          <Text fontSize="xs" color="whiteAlpha.500">You can use the form below with simplified debts, or specify the amount to settle.</Text>
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
  )
}