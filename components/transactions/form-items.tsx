import { useState } from "react";
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
  Box,
} from "@chakra-ui/react";
import {
  MdEuroSymbol, MdDriveFileRenameOutline, MdCategory,
  MdCalendarMonth, MdOutlineCategory
} from "react-icons/md"

import { FormItemWrapper } from '@/components/base-form-item';

import { type FormItemProps } from "@/types/form-item";
import { UserBasicData } from "@/types/model/users";
import { TransactionCategory, TransactionSubCategory } from "@/types/constants";

const FormIds : Record<string, string> = {
  name: 'name',
  amount: 'amount',
  amountDetails: 'amountDetails',
  category: 'category',
  subcategory: 'subcategory',
  datetime: 'datetime',
  paidBy: 'paidBy',
  everyone: 'everyone'
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

function FormItemName(
  { errors, register }: FormItemProps
) {
  return (
    <FormItemWrapper {...{ errors, id: FormIds.name, title: 'Name' }}>
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
    </FormItemWrapper >)
}

function FormItemAmountDetails(
  { errors, register, getValues, users }:
    FormItemProps & { users: UserBasicData[] }
) {
  const [everyone, setEveryone] = useState<boolean>(true)
  return (
    <FormItemWrapper {...{ errors, id: FormIds.everyone, title: 'Split' }}>
      <Button size={'sm'} variant={'solid'}
        width={'6rem'}
        colorScheme="loginbtn"
        bg={everyone ? 'gray.100' : 'gray.800'}
        color={everyone ? 'gray.800' : 'gray.600'}
        onClick={() => setEveryone(!everyone)}
        {...register('everyone', {
          required: false,
          value: everyone,
          validate: () => {
            if (!everyone) {
              let isUserSelected = false
              // Check if at least one user is selected
              for (const user of users) {
                if (getValues(`amountDetails.${user.id}.checked`)) {
                  isUserSelected = true;
                  break;
                }
              }
              if (!isUserSelected) return 'You must select at least one user'
              // Check if the sum of the amounts is equal to the total amount
              let sum = 0
              for (const user of users) {
                sum += getValues(`amountDetails.${user.id}.amount`)
              }
              if (sum > getValues('amount')) return 'The sum of the amounts is greater than the total amount'
            }
            return true
          }
        })}>Everyone</Button>
      {!everyone &&
        <VStack marginY={2} alignItems={'center'}>
          {users.map((user: UserBasicData) => (
            <FormItemAmountDetailsUser key={user.id} {...{ register, user, getValues }} />
          ))}
        </VStack>}
    </FormItemWrapper>
  )
}

function FormItemAmountDetailsUser(
  { register, user, getValues }: 
  FormItemProps & { user: UserBasicData }
) {
  const id = `${FormIds.amountDetails}.${user.id}.checked`
  return (
    <HStack key={user.id} paddingLeft={2} w='100%'
      borderColor={'gray.900'}
      borderWidth={1}
      borderRadius={'sm'}>
      <Checkbox {...register(id, {
        required: false,
      })}
        colorScheme={'gray'}
        size={'lg'}
        defaultChecked={false}
        w={'50%'}
        fontWeight={'light'}>
        <Text paddingLeft={2}
          fontSize={'md'}
          fontWeight={'light'}>{user.name}</Text>
      </Checkbox>
      <InputGroup size={'md'} w='50%'>
        <LeftIconWrapper>
          <MdEuroSymbol size={14} />
        </LeftIconWrapper>
        <NumberInput size={'md'}>
          <NumberInputField borderWidth={1} textIndent={'32px'}
            value={0}
            {...register(`amountDetails.${user.id}.amount`, {
              required: true,
              valueAsNumber: true,
              value: 0,
              max: {
                value: getValues('amount'),
                message: 'Amount greater than maximum',
              },
            })} />
        </NumberInput>
      </InputGroup>
    </HStack>
  )
}

function FormItemAmount(
  { errors, register }: FormItemProps
) {
  return (
    <FormItemWrapper {...{ errors, id: FormIds.amount, title: 'Amount' }}>
      <InputGroup >
        <LeftIconWrapper>
          <MdEuroSymbol />
        </LeftIconWrapper>
        <NumberInput w='100%'>
          <NumberInputField textIndent={'32px'}
            placeholder='Enter the amount'
            {...register(FormIds.amount, {
              required: 'No amount specified',
              valueAsNumber: true
            })} />
        </NumberInput>
      </InputGroup>
    </FormItemWrapper>
  )
}

function FormItemSubCategory(
  { errors, register }: FormItemProps
) {
  return (
    <FormItemWrapper {...{ errors, id: FormIds.subcategory, title: 'SubCategory' }}>
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
    </FormItemWrapper >)
}
function FormItemCategory(
  { errors, register }: FormItemProps
) {
  return (
    <FormItemWrapper {...{ errors, id: FormIds.category, title: 'Category' }}>
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
    </FormItemWrapper >)
}

function FormItemDateTime(
  { errors, register }: FormItemProps
) {
  return (
    <FormItemWrapper {...{ errors, id: FormIds.datetime, title: 'Date' }}>
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
    </FormItemWrapper >
  )
}

function FormItemPaidBy(
  { errors, register, users }: FormItemProps & { users: UserBasicData[] }
) {
  return (
    <FormItemWrapper {...{ errors, id: FormIds.paidBy, title: 'Paid by' }}>
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
    </FormItemWrapper >
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
  FormItemName,
  FormItemAmount,
  FormItemAmountDetails,
  FormItemCategory,
  FormItemSubCategory,
  FormItemDateTime,
  FormItemPaidBy,
  getCurrentDate
}