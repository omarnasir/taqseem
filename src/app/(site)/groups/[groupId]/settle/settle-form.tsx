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
  const defaultValues = {
    data:
    settlementDetails.map((settlement) => ({
      amount: settlement.amount.toString(),
      paidById: settlement.payor.userId,
      paidforId: settlement.payee.userId,
    }))
  }
  const methods = useForm<SettlementForm>({
    defaultValues:  defaultValues,
  });

  const {
    control,
    register,
    handleSubmit,
    clearErrors,
    getFieldState,
    reset,
    formState: { isValid }
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

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <HStack spacing={4} w={'100%'} justify={'space-between'} textAlign={'left'}
        borderBottom={'1px'} borderColor={'whiteAlpha.200'} paddingY={2} mt={4}>
          <Text w='33%' marginLeft={6} variant={'settlementCaption'}>Who pays?</Text>
          <Text w='33%' variant={'settlementCaption'}>How much?</Text>
          <Text w='33%' variant={'settlementCaption'}>Who gets?</Text>
        </HStack>
        {fields.map((field, index) => (
          <FormControl id={'data'} key={index} isInvalid={getFieldState(`data.${index}`).invalid}>
            <HStack>
              <Checkbox onChange={(e) => {
                if (!e.target.checked) update(index, { ...field, amount: '' })
                else update(index, { ...field, amount: '0' })
              }}
                variant={'settlement'}
                defaultChecked={true}
                rounded='full'
                width={'5%'}
                size={'md'}>
              </Checkbox>
              <Select variant='settlement' size={'sm'}
                {...register(`data.${index}.paidById` as const)}
                defaultValue={field.paidById}>
                {groupBalanceDetails.users.map((user) => (
                  <option key={user.userId} value={user.userId}>{user.userName}</option>
                ))}
              </Select>
              <InputGroup variant={"settlement"}>
                <InputLeftElement marginLeft={-2} marginTop={-1}>
                  <MdEuroSymbol color='gray'/>
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
                        paddingLeft={4}
                        placeholder={'0,0'}
                        textIndent={'0.5rem'}
                      />
                    </NumberInput>)} />
              </InputGroup>
              <Select variant='settlement' size={'sm'}
                {...register(`data.${index}.paidforId` as const)}
                defaultValue={field.paidforId}>
                {groupBalanceDetails.users.map((user) => (
                  data[index] ? data[index].paidById !== user.userId &&
                    <option key={user.userId} value={user.userId}>{user.userName}</option>
                    : <option key={user.userId} value={user.userId}>{user.userName}</option>
                ))}
              </Select>
            </HStack>
            <Divider />
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
              onClick={() => { reset(defaultValues); }} marginTop={2} />
          </HStack>
          <HStack spacing={2} w={'80%'} justifyContent={'flex-end'}>
            <Confirm callback={() => {
              handleSubmit(onSubmit)();
            }} mode="settlement">
              <Button variant={'settle'} size={'sm'} w={'40%'} isDisabled={!isValid || (fields.length === 0)} marginTop={2}>Settle</Button>
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