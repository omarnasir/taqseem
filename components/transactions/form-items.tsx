import React, { useState } from "react";
import {
  Input,
  Text,
  Select,
  NumberInput,
  NumberInputField,
  InputGroup,
  InputLeftElement,
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
} from "@chakra-ui/react";
import {
  MdEuroSymbol, MdDriveFileRenameOutline, MdCategory,
  MdCalendarMonth, MdOutlineCategory, MdOutlineCancel
} from "react-icons/md"
import { useFormContext, FieldErrors, useFieldArray, UseFieldArrayReturn, FieldValues, Controller  } from "react-hook-form";

import { UserBasicData } from "@/types/model/users";
import { TransactionCategoryEnum, TransactionSubCategoryEnum } from "@/types/constants";


type TFormIds = {
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
  datetime: string,
  paidBy: string,
}

enum FormIds {
  name = 'name',
  amount = 'amount',
  everyone = 'everyone',
  amountDetails = 'amountDetails',
  category = 'category',
  subcategory = 'subcategory',
  datetime = 'datetime',
  paidBy = 'paidBy',
}

function LeftIconWrapper({ children }: { children: React.ReactNode }) {
  return (
    <InputLeftElement 
      pointerEvents='none' 
      height='95%'
      mt={'1.2px'} ml={'1.2px'}
      borderLeftRadius={5}
      bg={'gray.900'}
      borderColor='gray.800'>
      {children}
    </InputLeftElement>
  )
}

function FormItemName() {
  const { formState: { errors }, register } = useFormContext()
  return (
    <FormControl id={FormIds.name} isInvalid={Boolean(errors[FormIds.name])} mb={3}>
      <FormLabel htmlFor={FormIds.name}>Name</FormLabel>
      <InputGroup >
        <LeftIconWrapper>
          <MdDriveFileRenameOutline />
        </LeftIconWrapper>
        <Input {...register(FormIds.name, {
          required: 'You must enter a name'
        })}
          placeholder='Give a name to the transaction'
          textIndent={'32px'} />
      </InputGroup>
      <FormErrorMessage>{errors[FormIds.name]?.message?.toString()}</FormErrorMessage>
    </FormControl>
  )
}

function FormItemAmountDetails({ users } : { users: UserBasicData[] }) {
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
        variant={'transactionEveryone'}
        isChecked={everyone}
        colorScheme={'white'}
        bg={everyone ? 'gray.100' : 'gray.800'}
        color={everyone ? 'black' : 'gray.600'}
        {...register(FormIds.everyone, {
          required: false,
          onChange: (e) => {
            setEveryone(e.target.checked);
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
        <VStack marginY={2} alignItems={'center'}>
          <Collapse in={isOpen} animateOpacity>
            {fields.map((field, index) => (
              <FormItemAmountDetailsUser
                key={field.id}
                registerId={`${FormIds.amountDetails}.${index}.amount`}
                user={users[index]}
                methods={methods}
                index={index} />
            ))}
          </Collapse>
        </VStack>
      </FormControl>
    </Box>
  )
}

function FormItemAmountDetailsUser({ index, registerId, user, methods }:
  { user: UserBasicData, index: number, registerId: string, methods: UseFieldArrayReturn<FieldValues, FormIds.amountDetails> }) 
{
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
    <FormControl id={registerId} mb={2}
      isInvalid={Boolean(checkIsFormAmountInvalid(errors))}>
      <HStack paddingLeft={2} w='sm'>
        <Checkbox onChange={(e) => {
          setSelected(e.target.checked);
          if (!e.target.checked) unregister(registerId)
        }}
          colorScheme={'gray'}
          size={'lg'}
          w='50%'>
          <Text paddingLeft={2}
            fontSize={'md'}
            fontWeight={'light'}>{user.name}</Text>
        </Checkbox>
        <InputGroup w='50%'>
          <LeftIconWrapper>
            <MdEuroSymbol size={'1rem'} />
          </LeftIconWrapper>
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
            render={({ field: {ref, name, value, ...restField} }) => (
              <NumberInput size={'md'} {...restField}
              value={value || ''}
              >
                <NumberInputField
                  ref={ref}
                  name={name}
                  disabled={restField.disabled}
                  placeholder={'auto'}
                  borderWidth={1} fontWeight={'light'}
                  textIndent={'32px'} />
                <InputRightElement color={'gray.500'}
                  onClick={() => resetField(registerId,
                    {
                      defaultValue: null,
                    })}>
                  <MdOutlineCancel size={'1rem'} />
                </InputRightElement>
              </NumberInput>)} />
        </InputGroup>
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
      <InputGroup >
        <LeftIconWrapper>
          <MdEuroSymbol />
        </LeftIconWrapper>
        <Controller
          name={FormIds.amount}
          control={control}
          rules={{
            required: 'No amount specified',
            validate: (value) => {
              if (value <= 0) return 'Amount must be greater than 0'
            }
          }}
          render={({ field : {ref, name, ...restField}}) => (
            <NumberInput w='100%' {...restField}>
              <NumberInputField
                ref={ref}
                name={name}
                fontWeight={'light'}
                textIndent={'32px'} />
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
      <InputGroup>
        <LeftIconWrapper>
          <MdOutlineCategory />
        </LeftIconWrapper>
        <Select {...register(FormIds.subcategory, {
          required: true,
          valueAsNumber: true
        })}
          title="Select a category"
          sx={{ paddingLeft: '3rem' }}>
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
      <InputGroup>
        <LeftIconWrapper>
          <MdCategory />
        </LeftIconWrapper>
        <Select {...register(FormIds.category, {
          required: true,
          valueAsNumber: true
        })}
          title="Select a sub-category"
          sx={{ paddingLeft: '3rem' }}>
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
    <FormControl id={FormIds.datetime} isInvalid={Boolean(errors[FormIds.datetime])} mb={3}>
      <FormLabel htmlFor={FormIds.datetime}>Date and time</FormLabel>
      <InputGroup>
        <LeftIconWrapper>
          <MdCalendarMonth />
        </LeftIconWrapper>
        <Input {...register(FormIds.datetime, {
          required: true,
        })}
          placeholder='Select a date and time'
          fontWeight={'light'}
          textIndent={'15px'}
          type='date'
          defaultValue={getCurrentDate()} />
      </InputGroup>
      <FormErrorMessage>{errors[FormIds.datetime]?.message?.toString()}</FormErrorMessage>
    </FormControl>
  )
}

function FormItemPaidBy({ users }: { users: UserBasicData[] }) {
  const { formState: { errors }, register } = useFormContext()
  return (
    <FormControl id={FormIds.paidBy} isInvalid={Boolean(errors[FormIds.paidBy])} mb={3}>
      <FormLabel htmlFor={FormIds.paidBy}>Paid by</FormLabel>
      <InputGroup>
        <LeftIconWrapper>
          <MdCategory />
        </LeftIconWrapper>
        <Select {...register(FormIds.paidBy, {
          required: true,
        })}
          title="Select a user"
          sx={{ paddingLeft: '3rem' }}>
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

function getCurrentDate() {
  const currentDate = new Date()
  const formatter = new Intl.DateTimeFormat('en-ca', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',

  })
  const formattedDate = formatter.format(currentDate)
  return formattedDate
}

export {
  type TFormIds,
  FormIds,
  FormItemName,
  FormItemAmount,
  FormItemAmountDetails,
  FormItemCategory,
  FormItemSubCategory,
  FormItemDateTime,
  FormItemPaidBy,
  processAmountDetails,
  getCurrentDate
}