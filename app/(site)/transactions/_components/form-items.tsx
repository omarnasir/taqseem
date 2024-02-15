import React, { useState } from "react";
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
import { useFormContext, FieldErrors, useFieldArray, UseFieldArrayReturn, FieldValues, Controller } from "react-hook-form";

import { UserBasicData } from "@/app/_types/model/users";
import { type TransactionWithDetails } from "@/app/_types/model/transactions";
import { TransactionCategoryEnum, TransactionSubCategoryEnum } from "@/app/_lib/db/constants";


type TFormIds = {
  id?: number,
  name: string,
  amount: string,
  everyone: boolean,
  amountDetails:
  {
    id: string,
    amount: string,
  }[],
  category: number,
  subcategory: number,
  paidAt: Date | string,
  paidBy: string,
  note: string
}

enum FormIds {
  id = 'id',
  name = 'name',
  amount = 'amount',
  everyone = 'everyone',
  amountDetails = 'amountDetails',
  category = 'category',
  subcategory = 'subcategory',
  paidAt = 'paidAt',
  paidBy = 'paidBy',
  note = 'note'
}

function FormItemId() {
  const { formState: { errors }, register } = useFormContext()
  return (
    <FormControl id={FormIds.id} isInvalid={Boolean(errors[FormIds.id])} mb={3}>
      <Input {...register(FormIds.id, {
        required: false
      })}
        hidden disabled />
    </FormControl>
  )
}

function FormItemName() {
  const { formState: { errors }, register } = useFormContext()
  return (
    <FormControl id={FormIds.name} isInvalid={Boolean(errors[FormIds.name])} mb={3}>
      <FormLabel htmlFor={FormIds.name}>Name</FormLabel>
      <InputGroup variant={"custom"}>
        <InputLeftAddon>
          <MdDriveFileRenameOutline />
        </InputLeftAddon>
        <Input {...register(FormIds.name, {
          required: 'You must enter a name'
        })}
          placeholder='Give a name to the transaction' />
      </InputGroup>
      <FormErrorMessage>{errors[FormIds.name]?.message?.toString()}</FormErrorMessage>
    </FormControl>
  )
}

function FormItemAmountDetails({ users }: { users: UserBasicData[] }) {
  const { formState: { errors },
    register,
    control,
    clearErrors,
    getValues } = useFormContext()
  const methods = useFieldArray({
    control,
    name: FormIds.amountDetails,
    shouldUnregister: true,
  })
  const { fields, append, remove } = methods
  const [everyone, setEveryone] = useState<boolean>(true)
  const { isOpen, onToggle } = useDisclosure()

  return (
    <Box>
      <FormLabel>Split</FormLabel>
      <Checkbox size={'md'} h='2rem' as={Button}
        mb={2}
        variant={'transactionEveryone'}
        isChecked={everyone}
        {...register(FormIds.everyone, {
          required: false,
          onChange: (e) => {
            setEveryone(e.target.checked);
            e.preventDefault();
            onToggle();
            clearErrors(FormIds.everyone);
            if (e.target.checked) remove()
            else append(users.map(user => ({ id: user.id, amount: null })))
          },
          validate: (value) => {
            if (!value) {
              const amountDetails = getValues(FormIds.amountDetails) as TFormIds[FormIds.amountDetails]
              if (amountDetails) {
                const { selectedUsers, usersWithoutInputAmount, sum } = processAmountDetails(amountDetails)
                if (selectedUsers.length === 0) return 'You must select at least one user'
                const totalAmount = parseFloat(getValues(FormIds.amount))

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
      <FormControl id={FormIds.everyone}
        isInvalid={Boolean(errors[FormIds.everyone])}>
        <FormErrorMessage>{errors[FormIds.everyone]?.message?.toString()}</FormErrorMessage>
        <Collapse in={isOpen} animateOpacity>
          <VStack alignItems={'center'} marginX={1}>
            {fields.map((field, index) => (
              <FormItemAmountDetailsUser
                key={field.id}
                registerId={`${FormIds.amountDetails}.${index}.amount`}
                user={users[index]}
                methods={methods}
                index={index} />
            ))}
          </VStack>
        </Collapse>
      </FormControl>
    </Box>
  )
}

function FormItemAmountDetailsUser({ index, registerId, user, methods }:
  { user: UserBasicData, index: number, registerId: string, methods: UseFieldArrayReturn<FieldValues, FormIds.amountDetails> }) {
  const { resetField, formState: { errors }, unregister, control } = useFormContext()
  const [selected, setSelected] = useState<boolean>(false)

  function extractNestedErrors(errors: FieldErrors<TFormIds>) {
    const nestedErrors = errors[FormIds.amountDetails]?.[index]?.amount
    return nestedErrors ? nestedErrors?.message?.toString() : ''
  }

  function checkIsFormAmountInvalid(errors: FieldErrors<TFormIds>) {
    return errors[FormIds.amountDetails]?.[index]?.amount ? true : false
  }

  return (
    <FormControl id={registerId}
      isInvalid={Boolean(checkIsFormAmountInvalid(errors))}>
      <HStack>
        <Checkbox onChange={(e) => {
          setSelected(e.target.checked);
          if (!e.target.checked) unregister(registerId)
        }}
          rounded='full'
          size={'lg'}
          w='50%'>
          <Text paddingLeft={2}
            fontSize={'md'}
            fontWeight={'light'}>{user.name}</Text>
        </Checkbox>
        <Controller
          name={registerId}
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
                value={value || ''}
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
                  onClick={() => resetField(registerId,
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
    <FormControl id={FormIds.amount} isInvalid={Boolean(errors[FormIds.amount])} mb={3}>
      <FormLabel htmlFor={FormIds.amount}>Amount</FormLabel>
      <InputGroup variant={"custom"}>
        <InputLeftAddon>
          <MdEuroSymbol />
        </InputLeftAddon>
        <Controller
          name={FormIds.amount}
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
      <FormErrorMessage>{errors[FormIds.amount]?.message?.toString()}</FormErrorMessage>
    </FormControl>
  )
}

function FormItemSubCategory() {
  const { formState: { errors }, register } = useFormContext()
  return (
    <FormControl id={FormIds.subcategory} isInvalid={Boolean(errors[FormIds.subcategory])} mb={3}>
      <FormLabel htmlFor={FormIds.subcategory}>Sub-category</FormLabel>
      <InputGroup variant={"custom"}>
        <InputLeftAddon>
          <MdOutlineCategory />
        </InputLeftAddon>
        <Select {...register(FormIds.subcategory, {
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
      <FormErrorMessage>{errors[FormIds.subcategory]?.message?.toString()}</FormErrorMessage>
    </FormControl>
  )
}

function FormItemCategory() {
  const { formState: { errors }, register } = useFormContext()
  return (
    <FormControl id={FormIds.category} isInvalid={Boolean(errors[FormIds.category])} mb={3}>
      <FormLabel htmlFor={FormIds.category}>Category</FormLabel>
      <InputGroup variant={"custom"}>
        <InputLeftAddon>
          <MdCategory />
        </InputLeftAddon>
        <Select {...register(FormIds.category, {
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
      <FormErrorMessage>{errors[FormIds.category]?.message?.toString()}</FormErrorMessage>
    </FormControl>
  )
}

function FormItemDateTime() {
  const { formState: { errors }, register } = useFormContext()
  return (
    <FormControl id={FormIds.paidAt} isInvalid={Boolean(errors[FormIds.paidAt])} mb={3}>
      <FormLabel htmlFor={FormIds.paidAt}>Date</FormLabel>
      <InputGroup variant={"custom"}>
        <InputLeftAddon>
          <MdCalendarMonth />
        </InputLeftAddon>
        <Input {...register(FormIds.paidAt, {
          required: true,
        })}
          textAlign={'left'}
          placeholder='Select a date and time'
          fontWeight={'light'}
          type='date'
          defaultValue={formatDateToString(new Date())} />
      </InputGroup>
      <FormErrorMessage>{errors[FormIds.paidAt]?.message?.toString()}</FormErrorMessage>
    </FormControl>
  )
}

function FormItemPaidBy({ users }: { users: UserBasicData[] }) {
  const { formState: { errors }, register } = useFormContext()
  return (
    <FormControl id={FormIds.paidBy} isInvalid={Boolean(errors[FormIds.paidBy])} mb={3}>
      <FormLabel htmlFor={FormIds.paidBy}>Paid by</FormLabel>
      <InputGroup variant={"custom"}>
        <InputLeftAddon>
          <MdCategory />
        </InputLeftAddon>
        <Select {...register(FormIds.paidBy, {
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
      <FormErrorMessage>{errors[FormIds.paidBy]?.message?.toString()}</FormErrorMessage>
    </FormControl>
  )
}

function processAmountDetails(amountDetails: TFormIds[FormIds.amountDetails])
  : {
    selectedUsers: TFormIds[FormIds.amountDetails],
    usersWithoutInputAmount: TFormIds[FormIds.amountDetails],
    sum: number
  } {
  const selectedUsers = amountDetails.filter((amountDetail) => amountDetail.amount !== undefined)
  const usersWithoutInputAmount = selectedUsers.filter((selectedUser) => (selectedUser.amount === null))
  const sum = amountDetails.reduce((acc: number, item) => acc + (parseFloat(item.amount) || 0), 0)

  return {
    selectedUsers,
    usersWithoutInputAmount,
    sum
  }
}

function FormItemNote() {
  const { formState: { errors }, register } = useFormContext()
  const id = FormIds.note
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
  type TFormIds,
  FormIds,
  FormItemId,
  FormItemName,
  FormItemAmount,
  FormItemAmountDetails,
  FormItemCategory,
  FormItemSubCategory,
  FormItemDateTime,
  FormItemPaidBy,
  FormItemNote,
  processAmountDetails,
  formatDateToString
}