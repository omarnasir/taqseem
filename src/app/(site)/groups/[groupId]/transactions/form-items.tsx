import React, { useEffect, useMemo, useState } from "react";
import {
  Input,
  Text,
  Select,
  NumberInput,
  NumberInputField,
  InputGroup,
  VStack,
  HStack,
  Checkbox,
  FormControl,
  FormErrorMessage,
  InputRightElement,
  InputLeftAddon,
  InputLeftElement,
  FormLabel,
  Button,
  ButtonGroup,
} from "@chakra-ui/react";
import {
  MdEuroSymbol, MdDriveFileRenameOutline, MdCategory,
  MdCalendarMonth, MdOutlineCategory, MdOutlineCancel,
  MdPerson
} from "react-icons/md"
import { useFormContext, useFieldArray, Controller, useWatch } from "react-hook-form";

import { UserBasicData } from "@/types/users.type";
import { TransactionCategoryEnum, TransactionSubCategoryEnum } from "@/lib/db/constants";
import { formatDateToString } from "./transaction";
import { CustomFormIcon } from "@/app/(site)/components/cardIcon";
import { FormIdEnum } from "./utils";


function FormItemId() {
  const { formState: { errors }, register } = useFormContext()
  return (
    <FormControl id={FormIdEnum.id} isInvalid={Boolean(errors[FormIdEnum.id])} p={0} m={0} height={0}>
      <Input {...register(FormIdEnum.id, {
        required: false
      })}
        
        hidden disabled />
    </FormControl>
  )
}

function FormItemName() {
  const { formState: { errors }, register } = useFormContext()

  return (
    <FormControl id={FormIdEnum.name} isInvalid={Boolean(errors[FormIdEnum.name])} marginBottom={1}>
      <FormLabel variant={'transaction'}>Name</FormLabel>
      <InputGroup variant={"transaction"} size={'md'}>
        <InputLeftElement>
          <CustomFormIcon icon={MdDriveFileRenameOutline} styleProps={{ color: "teal.600" }} />
        </InputLeftElement>
        <Input {...register(FormIdEnum.name, {
          required: 'You must enter a name',
        })}
          placeholder='Name' />
      </InputGroup>
      <FormErrorMessage>{errors[FormIdEnum.name]?.message?.toString()}</FormErrorMessage>
    </FormControl>
  )
}


function FormItemTransactionDetails({ users } : { users: UserBasicData[] }) 
{
  const {
    clearErrors,
    formState: { errors },
    control } = useFormContext()
  const { fields, replace, update } = useFieldArray({
    control,
    name: FormIdEnum.transactionDetails,
  })
  return (
    <VStack width={'100%'} >
      {/* <Text fontSize={'xs'}>€{(parseFloat(amount || 0) / users.length).toFixed(2)} each</Text> */}
      <FormControl id={FormIdEnum.transactionDetails} isInvalid={Boolean(errors[FormIdEnum.transactionDetails])}>
        <ButtonGroup marginY={2}>
          <Button onClick={() => {
            clearErrors(FormIdEnum.transactionDetails);
            replace(users.map(user => ({
              userId: user.id,
              amount: ''
            })))
          }}
          variant={'detailsUserEveryone'}>
            Everyone
          </Button>
          <Button onClick={() => {
            clearErrors(FormIdEnum.transactionDetails);
            replace(users.map(user => ({
              userId: user.id,
              amount: undefined
            })))
          }}
            variant={'detailsUserNone'}>
            None
          </Button>
      {/* <Text alignSelf={'center'} fontSize={'2xs'} fontWeight={'light'} w='50%'>
        You can leave the amount for a user empty if you want us to calculate it for you.
      </Text> */}
        </ButtonGroup>
        <VStack width={'100%'} >
          {fields && fields.map((field, index) => (
            <FormItemAmountDetailsUser
              key={field.id}
              control={control}
              update={update}
              user={users[index]}
              index={index}
              value={field} />
          ))}
        </VStack>
        <FormErrorMessage>{errors[FormIdEnum.transactionDetails]?.message?.toString()}</FormErrorMessage>
      </FormControl>
    </VStack>
  )
}

function FormItemAmountDetailsUser({ index, update, value, control, user }:
  { user: UserBasicData, index: number, control: any, update: any, value: any}) {
  const { clearErrors, getFieldState } = useFormContext()
  
  const registerAmount = useMemo(() => `${FormIdEnum.transactionDetails}.${index}.amount`, [index]);

  const [selected, setSelected] = useState<boolean>(value.amount !== undefined && value.amount !== '0');

  return (
    <FormControl id={registerAmount}
      isInvalid={getFieldState(registerAmount).invalid}>
      <HStack height={'2.5rem'}>
        <Checkbox onChange={(e) => {
          setSelected(e.target.checked);
          if (!e.target.checked) update(index, { ...value, amount: undefined });
          else update(index, { ...value, amount: '' });
          clearErrors(FormIdEnum.transactionDetails);
        }}
          defaultChecked={selected}
          variant={'transactionDetailsUser'}
          w='55%'>
          <Text fontSize={'sm'} fontWeight={300}>{user.name}</Text>
        </Checkbox>
        {selected &&
          <InputGroup variant={"transaction"} size={'md'}  w='45%'>
            <InputLeftAddon>
              <MdEuroSymbol size={'0.75rem'} color="green" />
            </InputLeftAddon>
            <Controller
              name={registerAmount}
              control={control}
              disabled={!selected}
              rules={{
                required: false,
                validate: (value) => value > 0 || value === ''
              }}
              render={({ field: { ref, name, onChange, ...restField } }) => (
                <NumberInput size={'md'} variant={'transaction'} w='100%'
                  {...restField}
                  onChange={(value) => {
                    getFieldState(FormIdEnum.transactionDetails).invalid && clearErrors(FormIdEnum.transactionDetails)
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
                    disabled={restField.disabled}
                    placeholder={'auto'}
                    fontSize={'md'}
                  />
                  <InputRightElement color={'gray.500'}
                    onClick={() => update(index, { ...value, amount: '' }, clearErrors(FormIdEnum.transactionDetails))}>
                    <MdOutlineCancel size={'0.8rem'} />
                  </InputRightElement>
                </NumberInput>)} />
          </InputGroup>
        }
      </HStack >
      <FormErrorMessage>
        {getFieldState(registerAmount).error?.message?.toString()}
      </FormErrorMessage>
    </FormControl>
  )
}

function FormItemAmount() {
  const { formState: { errors }, control } = useFormContext()

  return (
    <FormControl id={FormIdEnum.amount} isInvalid={Boolean(errors[FormIdEnum.amount])} marginBottom={1}>
      <FormLabel variant={'transaction'}>Amount</FormLabel>
      <InputGroup variant={"transaction"} size={'md'} >
        <InputLeftAddon>
          <MdEuroSymbol size={'0.75rem'} color="green" />
        </InputLeftAddon>
        <Controller
          name={FormIdEnum.amount}
          control={control}
          rules={{
            required: 'No amount specified',
            validate: (value) => {
              if (value <= 0) return 'Amount must be greater than 0'
            }
          }}
          render={({ field: { ref, name, ...restField } }) => (
            <NumberInput w='100%' variant={'transaction'} size={'md'}
              {...restField}
              isValidCharacter={(char) => {
                return (char >= '0' && char <= '9') || char === '.' || char === ','
              }}
              pattern={'[0-9]+([,.][0-9]+)?'}
              parse={(value) => {
                return value.replace(',', '.')
              }}
              format={(value) => {
                return value.toString().replace('.', ',')
              }}
            >
              <NumberInputField
                placeholder="0"
                ref={ref}
                name={name}
                fontSize={'md'}
              />
            </NumberInput>
          )}
        />
      </InputGroup>
      <FormErrorMessage>{errors[FormIdEnum.amount]?.message?.toString()}</FormErrorMessage>
    </FormControl>
  )
}

function FormItemSubCategory() {
  const { formState: { errors }, register } = useFormContext()

  const isSettlement = useWatch({ name: FormIdEnum.isSettlement})

  return (
    <FormControl isDisabled={isSettlement} id={FormIdEnum.subCategory} isInvalid={Boolean(errors[FormIdEnum.subCategory])} marginBottom={1}>
      <FormLabel variant={'transaction'}>SubCategory</FormLabel>
      <InputGroup variant={"transaction"} size={'md'} >
      <InputLeftElement>
        <CustomFormIcon icon={MdOutlineCategory} styleProps={{color: isSettlement ? "whiteAlpha.300" :  "red.600"}}/>
      </InputLeftElement>
        <Select {...register(FormIdEnum.subCategory, {
          required: true,
          valueAsNumber: true
        })}
          title="Select a category">
          {Object.entries(TransactionSubCategoryEnum).map(([key, value], index) => (
            <option key={key} value={index}>
              {value}
            </option>
          ))}

        </Select>
      </InputGroup>
      <FormErrorMessage>{errors[FormIdEnum.subCategory]?.message?.toString()}</FormErrorMessage>
    </FormControl>
  )
}

function FormItemCategory() {
  const { formState: { errors }, register } = useFormContext()

  const isSettlement = useWatch({ name: FormIdEnum.isSettlement})

  return (
    <FormControl isDisabled={isSettlement} id={FormIdEnum.category} isInvalid={Boolean(errors[FormIdEnum.category])} marginBottom={1}>
      <FormLabel variant={'transaction'}>Category</FormLabel>
      <InputGroup variant={"transaction"} size={'md'} >
        <InputLeftElement>
          <CustomFormIcon icon={MdCategory} styleProps={{color: isSettlement ? "whiteAlpha.300" :  "red.600"}}/>
        </InputLeftElement>
        <Select {...register(FormIdEnum.category, {
          required: true,
          valueAsNumber: true
        })}
          title="Select a sub-category">
          {Object.entries(TransactionCategoryEnum).map(([key, value], index) => (
            <option key={key} value={index}>
              {value}
            </option>
          ))}

        </Select>
      </InputGroup>
      <FormErrorMessage>{errors[FormIdEnum.category]?.message?.toString()}</FormErrorMessage>
    </FormControl>
  )
}

function FormItemDateTime() {
  const { formState: { errors }, register } = useFormContext()
  return (
    <FormControl id={FormIdEnum.paidAt} isInvalid={Boolean(errors[FormIdEnum.paidAt])} marginBottom={1}>
      <FormLabel variant={'transaction'}>Date</FormLabel>
      <InputGroup variant={"transaction"} size={'md'} >
        <InputLeftElement>
          <CustomFormIcon icon={MdCalendarMonth} styleProps={{ color: "yellow.600" }} />
        </InputLeftElement>
        <Input {...register(FormIdEnum.paidAt, {
          required: true,
        })}
          textAlign={'left'}
          placeholder='Select a date and time'
          fontWeight={'light'}
          type='date'
          defaultValue={formatDateToString(new Date())} />
      </InputGroup>
      <FormErrorMessage>{errors[FormIdEnum.paidAt]?.message?.toString()}</FormErrorMessage>
    </FormControl>
  )
}

function FormItemPaidBy({ users }: { users: UserBasicData[] }) {
  const { formState: { errors }, register } = useFormContext()
  return (
    <FormControl id={FormIdEnum.paidById} isInvalid={Boolean(errors[FormIdEnum.paidById])} marginBottom={1}>
          <FormLabel variant={'transaction'}>Paid By</FormLabel>
      <InputGroup variant={"transaction"} size={'md'} >
        <InputLeftElement>
          <CustomFormIcon icon={MdPerson} styleProps={{color:"purple.600"}}/>
        </InputLeftElement>
        <Select {...register(FormIdEnum.paidById, {
          required: true,
        })}
          title="Select a user">
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </Select>
      </InputGroup>
      <FormErrorMessage>{errors[FormIdEnum.paidById]?.message?.toString()}</FormErrorMessage>
    </FormControl>
  )
}

function FormItemNote() {
  const { formState: { errors }, register } = useFormContext()
  return (
    <FormControl id={FormIdEnum.notes} isInvalid={Boolean(errors[FormIdEnum.notes])} marginBottom={1}>
      <FormLabel variant={'transaction'}>Note</FormLabel>
        <InputGroup variant={"transaction"} size={'md'} >
          <InputLeftElement>
            <CustomFormIcon icon={MdDriveFileRenameOutline} styleProps={{ color: "orange.600", }} />
          </InputLeftElement>
          <Input {...register(FormIdEnum.notes, {
            required: false
          })}

            placeholder='Add a note'
            background={"transparent"}
          />
        </InputGroup>
        <FormErrorMessage>{errors[FormIdEnum.notes]?.message?.toString()}</FormErrorMessage>
    </FormControl>
  )
}


function FormItemIsSettlement() {
  const { formState: { errors }, register } = useFormContext()
  return (
    <FormControl w={'30%'} id={FormIdEnum.isSettlement} isInvalid={Boolean(errors[FormIdEnum.isSettlement])}>
      <InputGroup size={'md'} alignItems={'flex-start'}>
      <FormLabel variant={'transaction'}>Settlement?</FormLabel>
      <Checkbox variant={'settlement'}
      {...register(FormIdEnum.isSettlement, {
        required: false
      })} />
      </InputGroup>
      <FormErrorMessage>{errors[FormIdEnum.isSettlement]?.message?.toString()}</FormErrorMessage>
    </FormControl>
  )
}


export {
  FormItemId,
  FormItemName,
  FormItemAmount,
  FormItemTransactionDetails,
  FormItemCategory,
  FormItemSubCategory,
  FormItemDateTime,
  FormItemPaidBy,
  FormItemNote,
  FormItemIsSettlement
}