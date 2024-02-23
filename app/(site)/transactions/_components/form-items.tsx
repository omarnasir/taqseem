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
  Icon,
} from "@chakra-ui/react";
import {
  MdEuroSymbol, MdDriveFileRenameOutline, MdCategory,
  MdCalendarMonth, MdOutlineCategory, MdOutlineCancel
} from "react-icons/md"
import { useFormContext, FieldErrors, useFieldArray, Controller, useWatch } from "react-hook-form";

import { UserBasicData } from "@/app/_types/model/users";
import { type TCreateTransaction, type TCreateTransactionDetails } from "@/app/_types/model/transactions";
import { TransactionCategoryEnum, TransactionSubCategoryEnum } from "@/app/_lib/db/constants";

import {CustomFormIcon} from "@/app/(site)/_components/cardIcon";

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
    <FormControl id={TransactionFormIds.id} isInvalid={Boolean(errors[TransactionFormIds.id])} marginY={3}>
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
    <FormControl id={TransactionFormIds.name} isInvalid={Boolean(errors[TransactionFormIds.name])} marginBottom={3}>
      <HStack>
        <CustomFormIcon icon={MdDriveFileRenameOutline} styleProps={{bg:"teal.600"}}/>
        <InputGroup variant={"custom"}>
          <InputLeftAddon>
            <Text alignSelf={'center'}>Name</Text>
          </InputLeftAddon>
          <Input {...register(TransactionFormIds.name, {
            required: 'You must enter a name',
          })}
            placeholder='Name' />
        </InputGroup>
      <FormErrorMessage>{errors[TransactionFormIds.name]?.message?.toString()}</FormErrorMessage>
      </HStack>
    </FormControl>
  )
}

function FormItemTransactionDetails({ users } : { users: UserBasicData[],  }) 
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
    { defaultIsOpen: false }
  )

  useEffect(() => {
    const transactionDetails = getValues(TransactionFormIds.transactionDetails) as TFormTransaction[TransactionFormIds.transactionDetails]
    if (transactionDetails) {
      replace(transactionDetails.map(detail => {
        return {
          userId: detail.userId,
          amount: detail.amount.toString()
        }
      }));
      onOpen();
    }
    else {setValue(TransactionFormIds.everyone, true); remove();}
  }, [replace, setValue, getValues, onOpen, remove])

  return (
    <Box>
      <FormLabel variant={'transaction'}>Split</FormLabel>
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
  const { resetField, formState: { errors },unregister, control, register, getValues } = useFormContext()
  
  const userAmount = getValues(`${TransactionFormIds.transactionDetails}.${index}.${TransactionDetailsFormIds.amount}`);
  const [selected, setSelected] = useState<boolean>(userAmount !== undefined)

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
          defaultChecked={selected}
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
                value={value < 0 ? value : value || ''}
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
    <FormControl id={TransactionFormIds.amount} isInvalid={Boolean(errors[TransactionFormIds.amount])} marginY={3}>
      <HStack>
        <CustomFormIcon icon={MdEuroSymbol} styleProps={{bg:"green.600"}}/>
      <InputGroup variant={"custom"}>
      <InputLeftAddon>
        <Text alignSelf={'center'}>Amount</Text>
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
                return value.toString().replace('.', ',')
              }}
            >
              <NumberInputField
                ref={ref}
                name={name}
                fontSize={'lg'}
              />
            </NumberInput>
          )}
        />
      </InputGroup>
      <FormErrorMessage>{errors[TransactionFormIds.amount]?.message?.toString()}</FormErrorMessage>
      </HStack>
    </FormControl>
  )
}

function FormItemSubCategory() {
  const { formState: { errors }, register } = useFormContext()
  return (
    <FormControl id={TransactionFormIds.subCategory} isInvalid={Boolean(errors[TransactionFormIds.subCategory])} marginY={3}>
      <HStack>
        <CustomFormIcon icon={MdOutlineCategory} styleProps={{bg:"red.600"}}/>
      <InputGroup variant={"custom"}>
      <InputLeftAddon>
        <Text alignSelf={'center'}>SubCategory</Text>
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
      </HStack>
    </FormControl>
  )
}

function FormItemCategory() {
  const { formState: { errors }, register } = useFormContext()
  return (
    <FormControl id={TransactionFormIds.category} isInvalid={Boolean(errors[TransactionFormIds.category])} marginY={3}>
      <HStack>
        <CustomFormIcon icon={MdCategory} styleProps={{bg:"red.600"}}/>
      <InputGroup variant={"custom"}>
        <InputLeftAddon>
          <Text alignSelf={'center'}>Category</Text>
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
      </HStack>
    </FormControl>
  )
}

function FormItemDateTime() {
  const { formState: { errors }, register } = useFormContext()
  return (
    <FormControl id={TransactionFormIds.paidAt} isInvalid={Boolean(errors[TransactionFormIds.paidAt])} marginY={3}>
      <HStack>
        <CustomFormIcon icon={MdCalendarMonth} styleProps={{bg:"yellow.600"}}/>
      <InputGroup variant={"custom"}>
        <InputLeftAddon>
          <Text alignSelf={'center'}>Date</Text>
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
      </HStack>
    </FormControl>
  )
}

function FormItemPaidBy({ users }: { users: UserBasicData[] }) {
  const { formState: { errors }, register } = useFormContext()
  return (
    <FormControl id={TransactionFormIds.paidById} isInvalid={Boolean(errors[TransactionFormIds.paidById])} marginY={3}>
      <HStack>
        <CustomFormIcon icon={MdCategory} styleProps={{bg:"purple.600"}}/>
      <InputGroup variant={"custom"}>
        <InputLeftAddon>
          <Text alignSelf={'center'}>Paid By</Text>
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
      </HStack>
    </FormControl>
  )
}

function FormItemNote() {
  const { formState: { errors }, register } = useFormContext()
  const id = TransactionFormIds.notes
  return (
    <FormControl id={id} isInvalid={Boolean(errors[id])} marginY={3}>
      <HStack>
        <CustomFormIcon icon={MdDriveFileRenameOutline} styleProps={{bg:"orange.600",
        width: "2.5rem",
      }}/>
      <InputGroup variant={"custom"}>
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
      </HStack>
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