import React, { useEffect, useState } from "react";
import {
  Input,
  Text,
  Textarea,
  Select,
  NumberInput,
  NumberInputField,
  InputGroup,
  VStack,
  HStack,
  Checkbox,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useDisclosure,
  Collapse,
  Box,
  InputRightElement,
  InputLeftAddon,
} from "@chakra-ui/react";
import {
  MdEuroSymbol, MdDriveFileRenameOutline, MdCategory,
  MdCalendarMonth, MdOutlineCategory, MdOutlineCancel
} from "react-icons/md"
import { useFormContext, FieldErrors, useFieldArray, UseFieldArrayReturn, FieldValues, Controller, useWatch } from "react-hook-form";

import { UserBasicData } from "@/app/_types/model/users";
import { type TCreateTransaction, type TCreateTransactionDetails, type TTransactionWithDetails } from "@/app/_types/model/transactions";
import { TransactionCategoryEnum, TransactionSubCategoryEnum } from "@/app/_lib/db/constants";


enum TransactionFormIds {
  id = 'id',
  name = 'name',
  amount = 'amount',
  everyone = 'everyone',
  transactionDetails = 'transactionDetails',
  category = 'category',
  subCategory = 'subCategory',
  paidAt = 'paidAt',
  paidById = 'paidById',
  notes = 'notes'
}

enum TransactionDetailsFormIds {
  userId = 'userId',
  amount = 'amount'
}
type TFormTransactionDetails = Omit<TCreateTransactionDetails, "amount"> & {
  amount: string
}

interface TFormTransaction extends Omit<TCreateTransaction, "transactionDetails" | "amount"> {
  everyone: boolean,
  amount: string,
  transactionDetails: TFormTransactionDetails[]
}


function FormItemId() {
  const { formState: { errors }, register } = useFormContext()
  return (
    <FormControl id={TransactionFormIds.id} isInvalid={Boolean(errors[TransactionFormIds.id])} mb={3}>
      <Input {...register(TransactionFormIds.id, {
        required: false
      })}
        hidden disabled />
    </FormControl>
  )
}

function FormItemName() {
  const { formState: { errors }, register } = useFormContext()
  return (
    <FormControl id={TransactionFormIds.name} isInvalid={Boolean(errors[TransactionFormIds.name])} mb={3}>
      <FormLabel htmlFor={TransactionFormIds.name}>Name</FormLabel>
      <InputGroup variant={"custom"}>
        <InputLeftAddon>
          <MdDriveFileRenameOutline />
        </InputLeftAddon>
        <Input {...register(TransactionFormIds.name, {
          required: 'You must enter a name',
        })}
          placeholder='Give a name to the transaction' />
      </InputGroup>
      <FormErrorMessage>{errors[TransactionFormIds.name]?.message?.toString()}</FormErrorMessage>
    </FormControl>
  )
}

function FormItemTransactionDetails({ users, transactionDetails }: 
  { users: UserBasicData[], transactionDetails?: TTransactionWithDetails['transactionDetails'] }) 
{
  const { formState: { errors },
    register,
    control,
    clearErrors,
    setValue,
    getValues } = useFormContext()
  const methods = useFieldArray({
    control,
    name: TransactionFormIds.transactionDetails,
  })
  const { fields, remove, replace } = methods
  const everyone = useWatch({
    control,
    name: TransactionFormIds.everyone,
  });
  const { isOpen, onClose, onOpen } = useDisclosure(
    { defaultIsOpen: transactionDetails ? true : false}
  )

  useEffect(() => {
    if (transactionDetails) {
      replace(transactionDetails.map(detail => {
        return {
          userId: detail.userId,
          amount: detail.amount.toString()
        }
      }
      ))
    }
    else setValue(TransactionFormIds.everyone, true)
  }, [transactionDetails, replace, setValue])

  return (
    <Box>
      <FormLabel>Split</FormLabel>
      <Checkbox size={'md'} h='2rem' as={Button}
        mb={2}
        variant={'transactionEveryone'}
        isChecked={everyone}
        {...register(TransactionFormIds.everyone, {
          required: false,
          onChange: (e) => {
            clearErrors(TransactionFormIds.everyone);
            if (e.target.checked) {remove(), onClose()}
            else {replace(users.map(user => ({ id: user.id, amount: null }))), onOpen()}
          },
          validate: (value) => {
            if (!value) {
              const transactionDetails = getValues(TransactionFormIds.transactionDetails) as TFormTransaction[TransactionFormIds.transactionDetails]
              if (transactionDetails) {
                const { selectedUsers, usersWithoutInputAmount, sum } = processTransactionDetails(transactionDetails)
                if (selectedUsers.length === 0) return 'You must select at least one user'
                const totalAmount = parseFloat(getValues(TransactionFormIds.amount))

                if (sum > totalAmount) {
                  return 'The sum of the amounts is greater than the total amount'
                }
                if (sum === totalAmount && usersWithoutInputAmount.length > 0) {
                  return 'Some users are not participating in the transaction'
                }
                if (sum < totalAmount && usersWithoutInputAmount.length === 0) {
                  return 'Exact user amounts must add up to total amount'
                }
              }
            }
            return true
          }
        })}>Everyone</Checkbox>
      <FormControl id={TransactionFormIds.everyone}
        isInvalid={Boolean(errors[TransactionFormIds.everyone])}>
        <FormErrorMessage>{errors[TransactionFormIds.everyone]?.message?.toString()}</FormErrorMessage>
        <Collapse in={isOpen} animateOpacity>
          <VStack alignItems={'center'} marginX={1}>
            {fields.map((field, index) => (
              <FormItemAmountDetailsUser
                key={field.id}
                registerAmount={`${TransactionFormIds.transactionDetails}.${index}.${TransactionDetailsFormIds.amount}`}
                registerUserId={`${TransactionFormIds.transactionDetails}.${index}.${TransactionDetailsFormIds.userId}`}
                user={users[index]}
                index={index} />
            ))}
          </VStack>
        </Collapse>
      </FormControl>
    </Box>
  )
}

function FormItemAmountDetailsUser({ index, registerAmount, registerUserId, user }:
  { user: UserBasicData, index: number, registerAmount: string, registerUserId: string }) {
  const { resetField, formState: { errors }, unregister, control, register } = useFormContext()
  
  const userAmount = useWatch({
    control,
    name: `${TransactionFormIds.transactionDetails}.${index}.${TransactionDetailsFormIds.amount}`,
  });
  const [selected, setSelected] = useState<boolean>(userAmount!==undefined)

  function extractNestedErrors(errors: FieldErrors<TFormTransaction>) {
    const nestedErrors = errors[TransactionFormIds.transactionDetails]?.[index]?.amount
    return nestedErrors ? nestedErrors?.message?.toString() : ''
  }

  function checkIsFormAmountInvalid(errors: FieldErrors<TFormTransaction>) {
    return errors[TransactionFormIds.transactionDetails]?.[index]?.amount ? true : false
  }

  return (
    <FormControl id={registerAmount}
      isInvalid={Boolean(checkIsFormAmountInvalid(errors))}>
        <Input {...register(registerUserId, {
          required: false,
          value: user.id
        })}
          hidden />
      <HStack>
        <Checkbox onChange={(e) => {
          setSelected(e.target.checked);
          if (!e.target.checked) unregister(registerAmount)
        }}
          defaultChecked={userAmount !== null}
          colorScheme={'gray'}
          variant={'transactionDetailsUser'}
          rounded='full'
          size={'lg'}
          w='50%'>
          <Text paddingLeft={2}
            fontSize={'md'}
            fontWeight={'light'}>{user.name}</Text>
        </Checkbox>
        <Controller
          name={registerAmount}
          control={control}
          disabled={!selected}
          rules={{
            required: false,
            validate: (value) => {
              if (value <= 0 && (value !== '' && value !== null)) return 'Amount must be greater than 0'
            }
          }}
          render={({ field: { ref, name, value, ...restField } }) => (
            <InputGroup variant={"custom"} w='50%'>
              <InputLeftAddon>
                <MdEuroSymbol size={'0.75rem'} />
              </InputLeftAddon>
              <NumberInput size={'md'} {...restField} variant={'custom'}
                value={value < 0 ? value * -1 : value || ''}
                isValidCharacter={(char) => {
                  return (char >= '0' && char <= '9') || char === '.' || char === ','
                }}
                pattern={'[0-9]+([,.][0-9]+)?'}
                parse={(value) => {
                  return value.replace(',', '.')
                }}
                format={(value) => {
                  if (typeof value === 'string') {
                    return value.replace('.', ',')
                  }
                  return value
                }}
              >
                <NumberInputField
                  ref={ref}
                  name={name}
                  disabled={restField.disabled}
                  placeholder={'auto'}
                  textIndent={'0.5rem'}
                />
                <InputRightElement color={'gray.500'}
                  onClick={() => resetField(registerAmount,
                    {
                      defaultValue: null,
                    })}>
                  <MdOutlineCancel size={'1rem'} />
                </InputRightElement>
              </NumberInput>
            </InputGroup>)} />
      </HStack >
      <FormErrorMessage>
        {extractNestedErrors(errors)}
      </FormErrorMessage>
    </FormControl>
  )
}

function FormItemAmount() {
  const { formState: { errors }, control } = useFormContext()

  return (
    <FormControl id={TransactionFormIds.amount} isInvalid={Boolean(errors[TransactionFormIds.amount])} mb={3}>
      <FormLabel htmlFor={TransactionFormIds.amount}>Amount</FormLabel>
      <InputGroup variant={"custom"}>
        <InputLeftAddon>
          <MdEuroSymbol />
        </InputLeftAddon>
        <Controller
          name={TransactionFormIds.amount}
          control={control}
          rules={{
            required: 'No amount specified',
            validate: (value) => {
              if (value <= 0) return 'Amount must be greater than 0'
            }
          }}
          render={({ field: { ref, name, ...restField } }) => (
            <NumberInput w='100%' variant={'custom'}
              {...restField}
              isValidCharacter={(char) => {
                return (char >= '0' && char <= '9') || char === '.' || char === ','
              }}
              pattern={'[0-9]+([,.][0-9]+)?'}
              parse={(value) => {
                return value.replace(',', '.')
              }}
              format={(value) => {
                if (typeof value === 'string') {
                  return value.replace('.', ',')
                }
                return value
              }}
            >
              <NumberInputField
                ref={ref}
                name={name}
                fontWeight={'light'}
              />
            </NumberInput>
          )}
        />
      </InputGroup>
      <FormErrorMessage>{errors[TransactionFormIds.amount]?.message?.toString()}</FormErrorMessage>
    </FormControl>
  )
}

function FormItemSubCategory() {
  const { formState: { errors }, register } = useFormContext()
  return (
    <FormControl id={TransactionFormIds.subCategory} isInvalid={Boolean(errors[TransactionFormIds.subCategory])} mb={3}>
      <FormLabel htmlFor={TransactionFormIds.subCategory}>Sub-category</FormLabel>
      <InputGroup variant={"custom"}>
        <InputLeftAddon>
          <MdOutlineCategory />
        </InputLeftAddon>
        <Select {...register(TransactionFormIds.subCategory, {
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
      <FormErrorMessage>{errors[TransactionFormIds.subCategory]?.message?.toString()}</FormErrorMessage>
    </FormControl>
  )
}

function FormItemCategory() {
  const { formState: { errors }, register } = useFormContext()
  return (
    <FormControl id={TransactionFormIds.category} isInvalid={Boolean(errors[TransactionFormIds.category])} mb={3}>
      <FormLabel htmlFor={TransactionFormIds.category}>Category</FormLabel>
      <InputGroup variant={"custom"}>
        <InputLeftAddon>
          <MdCategory />
        </InputLeftAddon>
        <Select {...register(TransactionFormIds.category, {
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
      <FormErrorMessage>{errors[TransactionFormIds.category]?.message?.toString()}</FormErrorMessage>
    </FormControl>
  )
}

function FormItemDateTime() {
  const { formState: { errors }, register } = useFormContext()
  return (
    <FormControl id={TransactionFormIds.paidAt} isInvalid={Boolean(errors[TransactionFormIds.paidAt])} mb={3}>
      <FormLabel htmlFor={TransactionFormIds.paidAt}>Date</FormLabel>
      <InputGroup variant={"custom"}>
        <InputLeftAddon>
          <MdCalendarMonth />
        </InputLeftAddon>
        <Input {...register(TransactionFormIds.paidAt, {
          required: true,
        })}
          textAlign={'left'}
          placeholder='Select a date and time'
          fontWeight={'light'}
          type='date'
          defaultValue={formatDateToString(new Date())} />
      </InputGroup>
      <FormErrorMessage>{errors[TransactionFormIds.paidAt]?.message?.toString()}</FormErrorMessage>
    </FormControl>
  )
}

function FormItemPaidBy({ users }: { users: UserBasicData[] }) {
  const { formState: { errors }, register } = useFormContext()
  return (
    <FormControl id={TransactionFormIds.paidById} isInvalid={Boolean(errors[TransactionFormIds.paidById])} mb={3}>
      <FormLabel htmlFor={TransactionFormIds.paidById}>Paid by</FormLabel>
      <InputGroup variant={"custom"}>
        <InputLeftAddon>
          <MdCategory />
        </InputLeftAddon>
        <Select {...register(TransactionFormIds.paidById, {
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
      <FormErrorMessage>{errors[TransactionFormIds.paidById]?.message?.toString()}</FormErrorMessage>
    </FormControl>
  )
}

function processTransactionDetails(transactionDetails: TFormTransactionDetails[])
  : {
    selectedUsers: TFormTransactionDetails[],
    usersWithoutInputAmount: TFormTransactionDetails[],
    sum: number
  } {
  const selectedUsers = transactionDetails.filter((transactionDetails) => transactionDetails.amount !== undefined)
  const usersWithoutInputAmount = selectedUsers.filter((selectedUser) => (selectedUser.amount === null))
  const sum = transactionDetails.reduce((acc: number, item) => acc + (parseFloat(item.amount) || 0), 0)

  return {
    selectedUsers,
    usersWithoutInputAmount,
    sum
  }
}

function FormItemNote() {
  const { formState: { errors }, register } = useFormContext()
  const id = TransactionFormIds.notes
  return (
    <FormControl id={id} isInvalid={Boolean(errors[id])} mb={3}>
      <FormLabel htmlFor={id}>Name</FormLabel>
      <InputGroup variant={"custom"}>
        <InputLeftAddon>
          <MdDriveFileRenameOutline />
        </InputLeftAddon>
        <Textarea {...register(id, {
          required: false
        })}
          placeholder='Add a note'
          background={"transparent"}
          borderWidth={0}
          resize={"none"}
        />
      </InputGroup>
      <FormErrorMessage>{errors[id]?.message?.toString()}</FormErrorMessage>
    </FormControl>
  )
}

function formatDateToString(date: Date) {
  const formattedDate = new Date(date).toLocaleDateString('en-ca', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  })
  return formattedDate
}

export {
  type TFormTransaction,
  type TFormTransactionDetails,
  TransactionFormIds,
  FormItemId,
  FormItemName,
  FormItemAmount,
  FormItemTransactionDetails,
  FormItemCategory,
  FormItemSubCategory,
  FormItemDateTime,
  FormItemPaidBy,
  FormItemNote,
  processTransactionDetails,
  formatDateToString
}