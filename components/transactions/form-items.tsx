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
  FormLabel,
  Box,
} from "@chakra-ui/react";
import {
  MdEuroSymbol, MdDriveFileRenameOutline, MdCategory,
  MdCalendarMonth, MdDone
} from "react-icons/md"

import { FormItemWrapper } from '@/components/base-form-item';

import { type FormItemProps } from "@/types/form-item";

import { UserBasicData } from "@/types/model/users";
import { useState } from "react";

const InputLeftElementStyleProps = {
  borderRightWidth: 1,
  borderColor: 'gray.700'
}

function FormItemName(
  { errors, register }: FormItemProps
) {
  const id = 'name'

  return (
    <FormItemWrapper {...{ errors, id, title: 'Name' }}>
      <InputGroup >
        <InputLeftElement pointerEvents='none' {...InputLeftElementStyleProps}>
          <MdDriveFileRenameOutline/>
        </InputLeftElement>
        <Input {...register(id, {
          required: 'You must enter a name'
        })}
        placeholder='Give a name to the transaction' 
        textIndent={'7px'}/>
      </InputGroup>
    </FormItemWrapper >)
}

function FormItemAmount(
  {errors, register, getValues, users} : 
  FormItemProps & { users: UserBasicData[] }
) {
  const [everyone, setEveryone] = useState<boolean>(true)

  const amountId = 'amount'
  return (
    <>
      <FormItemWrapper {...{ errors, id: amountId, title: 'Amount' }}>
        <InputGroup >
          <InputLeftElement pointerEvents='none' {...InputLeftElementStyleProps}>
            <MdEuroSymbol />
          </InputLeftElement>
          <NumberInput w='100%'>
            <NumberInputField textIndent={'32px'}
              placeholder='Enter the amount'
              {...register(amountId, {
                required: 'No amount specified',
                valueAsNumber: true
              })} />
          </NumberInput>
        </InputGroup>
      </FormItemWrapper>
      <FormItemWrapper {...{ errors, id: 'everyone' }}>
        <FormLabel mt={'3'}
          fontSize={'sm'}
          fontWeight={'light'}>Split</FormLabel>
        <Box borderColor={'white.100'} borderWidth={1}
          borderRadius={6}
          p={2}>
          <Button size={'sm'} variant={'solid'}
            onClick={() => setEveryone(!everyone)}
            colorScheme="loginbtn"
            bg={everyone ? 'gray.100' : 'gray.800'}
            color={everyone ? 'gray.800' : 'gray.600'}
            leftIcon={everyone ? <MdDone color="black" size={20} /> : <div />}
            {...register('everyone', {
              required: false,
              value: everyone,
              validate: value => {
                if (!everyone) {
                  // Check if at least one user is selected
                  for (const user of users) {
                    if (getValues(`amountDetails.${user.id}.checked`)) {
                      return true
                    }
                  }
                  return 'You must select at least one user'
                }
                return true
              }
            })}
          >Everyone</Button>
          {!everyone &&
            <VStack mt={4}>
              {users.map((user: UserBasicData) => (
                <HStack key={user.id} w='100%' paddingX={2} justifyContent={'flex-start'}>
                  <HStack w='50%'>
                    <Checkbox size={'md'} pr={2} colorScheme={'gray'} defaultChecked={false}
                      {...register(`amountDetails.${user.id}.checked`)}
                    />
                    <Text fontSize={'sm'} fontWeight={'light'}>{user.name}</Text>
                  </HStack>
                  <FormItemWrapper {...{ errors, id: `amountDetails.${user.id}.amount` }}>
                    <InputGroup size={'sm'} w='50%'>
                      <InputLeftElement pointerEvents='none' {...InputLeftElementStyleProps}>
                        <MdEuroSymbol size={14} />
                      </InputLeftElement>
                      <NumberInput size={'sm'}>
                        <NumberInputField borderRadius={5} textIndent={'32px'}
                          {...register(`amountDetails.${user.id}.amount`, {
                            valueAsNumber: true,
                            max: { value: getValues(amountId), message: 'Amount greater than maximum', }
                          })} />
                      </NumberInput>
                    </InputGroup>
                  </FormItemWrapper>
                </HStack>
              ))}
            </VStack>}
        </Box>
      </FormItemWrapper>
    </>
  )
}

function FormItemCategory(
  { errors, register }: FormItemProps
) {
  const id = 'category'

  const options = [
    { value: 'food', label: 'Food' },
    { value: 'transport', label: 'Transport' },
    { value: 'house', label: 'House' },
    { value: 'fun', label: 'Fun' },
    { value: 'other', label: 'Other' },
  ]

  return (
    <FormItemWrapper {...{ errors, id, title: 'Category' }}>
      <InputGroup>
        <InputLeftElement pointerEvents='none' {...InputLeftElementStyleProps}>
          <MdCategory />
        </InputLeftElement>
        <Select {...register(id, {
          required: true,
        })}
        title="Select a category"
        sx={{ paddingLeft: '3rem' }}>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
          </Select>
      </InputGroup>
    </FormItemWrapper >)
}

function FormItemDateTime(
  { errors, register }: FormItemProps
) { 
  const id = 'datetime'
 
  return (
    <FormItemWrapper {...{ errors, id, title: 'Date' }}>
      <InputGroup>
        <InputLeftElement pointerEvents='none' {...InputLeftElementStyleProps}>
          <MdCalendarMonth />
        </InputLeftElement>
        <Input {...register(id, {
          required: true,
        })} 
        placeholder='Select a date and time'
          fontWeight={'light'}
          textIndent={'3px'}
          type='date'
          defaultValue={getCurrentDate()} />
      </InputGroup>
    </FormItemWrapper >
  )
}

function FormItemPaidBy(
  { errors, register, users }: FormItemProps & { users: UserBasicData[] }
) {
  const id = 'paidBy'

  return (
      <FormItemWrapper {...{ errors, id, title:'Paid by' }}>
        <InputGroup>
          <InputLeftElement pointerEvents='none' {...InputLeftElementStyleProps}>
            <MdCategory />
          </InputLeftElement>
          <Select {...register(id, {
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
  FormItemCategory,
  FormItemDateTime,
  FormItemPaidBy,
  getCurrentDate
}