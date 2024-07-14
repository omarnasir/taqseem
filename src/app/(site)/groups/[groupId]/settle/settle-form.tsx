import { useRouter } from 'next/navigation';

import { useForm, useFieldArray, useWatch, FormProvider, Controller } from "react-hook-form";

import { 
  HStack, 
  FormControl, 
  Checkbox, 
  Select, 
  InputGroup, 
  InputLeftElement, 
  NumberInput, 
  NumberInputField, 
  Divider, 
  IconButton, 
  Button, 
  FormErrorMessage,
  Text
} from "@chakra-ui/react";

import { MdEuroSymbol,
  MdAdd as MdAddIcon,
  MdDelete as MdDeleteIcon,
  MdLockReset as MdResetIcon,
 } from 'react-icons/md';

import { Confirm } from "@/app/(site)/components/confirm";
import { useSessionHook } from "@/client/hooks/session.hook";
import { createTransactionAction } from "@/server/actions/transactions.action";
import { SimplifiedBalances, GroupBalanceDetails } from "@/types/groups.type";
import { CreateTransaction } from "@/types/transactions.type";


type SettlementForm = {
  data: {
    amount: string,
    paidById: string,
    paidforId: string,
  }[]
}

export function SettleForm({ groupId , settlementDetails, groupBalanceDetails }:
  { groupId: string , settlementDetails: SimplifiedBalances[] , groupBalanceDetails: GroupBalanceDetails }) {

  const { session } = useSessionHook();
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

  const { fields, update, append, remove, replace } = useFieldArray({
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

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <HStack spacing={1}  w={'100%'} justify={'space-between'}
        borderBottom={'1px'} borderColor={'whiteAlpha.200'} paddingY={2}>
          <Text variant={'settlementCaption'}>Who pays?</Text>
          <Text variant={'settlementCaption'}>How much?</Text>
          <Text variant={'settlementCaption'}>Who gets?</Text>
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
                      value={field.amount}
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
            replace(settlementDetails.map((settlement, index) => {
              return {
                amount: settlement.amount.toString(),
                paidById: settlement.payor.userId,
                paidforId: settlement.payee.userId,
              }
            }))
          }}
          marginTop={2} />
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