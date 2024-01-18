import React, { useEffect, useState } from "react";
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
  SlideFade,
  Collapse,
} from "@chakra-ui/react";
import {
  MdEuroSymbol, MdDriveFileRenameOutline, MdCategory,
  MdCalendarMonth, MdOutlineCategory
} from "react-icons/md"

import { UserBasicData } from "@/types/model/users";
import { TransactionCategory, TransactionSubCategory } from "@/types/constants";
import { useFormContext, FieldErrors  } from "react-hook-form";


type TFormIds = {
  name: string,
  amount: number,
  amountDetails?: {
    [key: string]: number
  },
  category: string,
  subcategory: string,
  datetime: string,
  paidBy: string,
}

enum FormIds {
  name = 'name',
  amount = 'amount',
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
  const { formState: { errors }, register, getValues } = useFormContext()
  const [everyone, setEveryone] = useState<boolean>(true)
  const { isOpen, onToggle } = useDisclosure()

  return (
    <>
      <FormLabel>Split</FormLabel>
      <Button size={'sm'} width={'6rem'}
        bg={everyone ? 'gray.100' : 'gray.800'}
        color={everyone ? 'gray.800' : 'gray.600'}
        onClick={() => {
          setEveryone(!everyone);
          onToggle();}}>Everyone</Button>
      <FormControl id={FormIds.amountDetails}
        isInvalid={Boolean(errors[FormIds.amountDetails])}>
        <FormErrorMessage>{errors[FormIds.amountDetails]?.message?.toString()}</FormErrorMessage>
        <VStack marginY={2} alignItems={'center'}
          {...register(FormIds.amountDetails, {
            required: false,
            validate: (value) => {
              if (!everyone) {
                const amountDetails = value as TFormIds[FormIds.amountDetails]
                if (amountDetails) {
                  const anyUserSelected = Object.keys(amountDetails)
                  if (!anyUserSelected) return 'You must select at least one user'
                  const sum = Object.values(amountDetails).reduce((acc, amount) => acc + amount, 0)
                  if (sum > getValues('amount')) return 'The sum of the amounts is greater than the total amount'
                }
              }
              return true
            }
          })}>
          {!everyone &&
            <Collapse in={isOpen} animateOpacity>
              {users.map((user: UserBasicData) => (
                <FormItemAmountDetailsUser key={user.id} user={user} />))}
            </Collapse>}
        </VStack>
      </FormControl>
    </>
  )
}

function FormItemAmountDetailsUser({ user }: { user: UserBasicData }) {
  const [selected, setSelected] = useState<boolean>(false)
  const { register, formState: { errors }, unregister } = useFormContext()

  useEffect(() => {
    setSelected(true)
  }, [register])

  function extractNestedErrors(errors: FieldErrors<TFormIds>, user: UserBasicData) {
    const nestedErrors = errors[FormIds.amountDetails]?.[user.id]
    if (nestedErrors) {
      return nestedErrors?.message?.toString()
    }
    return ''
  }

  function checkIsFormAmountInvalid(errors: FieldErrors<TFormIds>) {
    
  if (errors[FormIds.amountDetails]?.[user.id]) {
      return true
    }
    return false
  }

  return (
    <FormControl id={`${FormIds.amountDetails}.${user.id}`} mb={2}
      isInvalid={Boolean(checkIsFormAmountInvalid(errors))}>
      <HStack paddingLeft={2} w='sm'>
        <Checkbox onChange={(e) => {
          setSelected(e.target.checked);
          if (!e.target.checked) {
            unregister(`${FormIds.amountDetails}.${user.id}`)
          }
        }}
          defaultChecked={true}
          colorScheme={'gray'}
          size={'lg'}
          w='50%'>
          <Text paddingLeft={2}
            fontSize={'md'}
            fontWeight={'light'}>{user.name}</Text>
        </Checkbox>
        {selected &&
          <InputGroup w='50%'>
            <LeftIconWrapper>
              <MdEuroSymbol size={'1rem'} />
            </LeftIconWrapper>
            <NumberInput defaultValue={0} size={'md'}>
              <NumberInputField
                {...register(`${FormIds.amountDetails}.${user.id}`, {
                  required: false,
                  setValueAs: (value: any) => {
                    if (isNaN(value) || value === '') return 0
                    return parseFloat(value)
                  },
                  min: {
                    value: 0,
                    message: 'Amount less than minimum',
                  }
                })}
                borderWidth={1} fontWeight={'light'}
                textIndent={'32px'} />
            </NumberInput>
          </InputGroup>}
      </HStack >
      <FormErrorMessage>
        {extractNestedErrors(errors, user)}
      </FormErrorMessage>
    </FormControl>
  )
}

function FormItemAmount() {
  const { formState: { errors }, register } = useFormContext()

  return (
    <FormControl id={FormIds.amount} isInvalid={Boolean(errors[FormIds.amount])} mb={3}>
      <FormLabel htmlFor={FormIds.amount}>Amount</FormLabel>
      <InputGroup >
        <LeftIconWrapper>
          <MdEuroSymbol />
        </LeftIconWrapper>
        <NumberInput w='100%'>
          <NumberInputField textIndent={'32px'}
            placeholder='Enter the amount'
            {...register(FormIds.amount, {
              required: 'No amount specified',
              valueAsNumber: true,
              min: {
                value: 0,
                message: 'Amount less than minimum',
              }
            })} />
        </NumberInput>
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
            {Object.entries(TransactionSubCategory).map(([key, value]) => (
              <option key={key} value={value.id}>
                {value.name}
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
            {Object.entries(TransactionCategory).map(([key, value]) => (
              <option key={key} value={value.id}>
                {value.name}
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
  getCurrentDate
}