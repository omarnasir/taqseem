import React, { useEffect, useMemo, useState } from "react";
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
  FormErrorMessage,
  InputRightElement,
  InputLeftAddon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
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
import { useSession } from "next-auth/react";

enum TransactionFormIds {
  id = 'id',
  name = 'name',
  amount = 'amount',
  strategy = 'strategy',
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

// This type defines the Transaction details form data that will be sent to the server
// We will also reuse this type to define the form data that will be received from the server
type TFormTransactionDetails = Omit<TCreateTransactionDetails, "amount"> & {
  amount: string
}

// This type defines the main Transaction form data that will be sent to the server
// We will also reuse this type to define the form data that will be received from the server
interface TFormTransaction extends Omit<TCreateTransaction, "transactionDetails" | "amount"> {
  amount: string,
  transactionDetails: TFormTransactionDetails[]
}


function FormItemId() {
  const { formState: { errors }, register } = useFormContext()
  return (
    <FormControl id={TransactionFormIds.id} isInvalid={Boolean(errors[TransactionFormIds.id])}>
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
        <InputGroup variant={"transaction"}>
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

function TransactionStrategyDecisionCheckbox({ user, index }: { user: UserBasicData, index: number }) {
  const { data: sessionData } = useSession();
  const { getValues, setValue } = useFormContext();
  const strategy = getValues(TransactionFormIds.strategy);
  const amount = parseFloat(getValues(TransactionFormIds.amount) || 0).toFixed(2);

  const isUserSessionUser = useMemo(() => user.id === sessionData?.user.id, [user.id, sessionData?.user.id]);
  const variant = useMemo(() => isUserSessionUser ? 'transactionStrategyYou' : 'transactionStrategyThem', [isUserSessionUser]);
  
  return (
    <Checkbox size={'md'} as={Button} variant={variant}
    onChange={() => {
        setValue(TransactionFormIds.strategy, index + 1)
      }}
      defaultChecked={strategy === index + 1}
      isChecked={strategy === index + 1}>{isUserSessionUser ? 'You owe' : user.name + ' pays'} €{amount}
    </Checkbox>
  )
}

function FormItemTransactionStrategy({ users } : { users: UserBasicData[],  }) 
{
  const { formState: { errors },
    register,
    unregister,
    control,
    setValue,
    getValues } = useFormContext()
  const { fields, replace } = useFieldArray({
    control,
    name: TransactionFormIds.transactionDetails,
  })
  const strategy = useWatch({
    control,
    name: TransactionFormIds.strategy,
  });
  const amount = parseFloat(getValues(TransactionFormIds.amount) || 0)

  useEffect(() => {
    const receivedTransactionDetails = getValues(TransactionFormIds.transactionDetails) as TFormTransaction[TransactionFormIds.transactionDetails]
    if (strategy === -1) {
      replace(receivedTransactionDetails.map(detail => {
        return {
          userId: detail.userId,
          amount: detail.amount
        }
      }))
    }
  }, [replace, getValues, strategy])

  return (
    <FormControl id={TransactionFormIds.strategy} isInvalid={Boolean(errors[TransactionFormIds.strategy])} marginBottom={3}>
      <HStack width={'100%'} {...register(TransactionFormIds.strategy,
          { required: false, }
        )}>
      <Accordion width={'100%'}  defaultIndex={strategy === -1 ? [1] : [0]} variant='transaction'>
        <AccordionItem>
          <h2>
            <AccordionButton onClick={() => unregister(TransactionFormIds.transactionDetails)}>
              <Text alignSelf={'center'}>Based on People</Text>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel>
            {/* TODO: Change Checkbox to a custom Radio group */}
            <VStack width={'100%'} spacing={3}>
              <Checkbox size={'md'} as={Button} variant={'transactionStrategyEveryone'}
                onChange={() => {
                  setValue(TransactionFormIds.strategy, 0)
                }}
                defaultChecked={strategy === 0}
                isChecked={strategy === 0}>Everyone owes €{(amount / users.length).toFixed(2)}</Checkbox>
              {users.map((user, index) =>
                user.id !== getValues(TransactionFormIds.paidById) &&
                <TransactionStrategyDecisionCheckbox key={user.id} user={user} index={index}/>
              )}
            </VStack>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <h2>
            <AccordionButton onClick={() => {
              replace(users.map(user => ({ id: user.id, amount: null })));
              setValue(TransactionFormIds.strategy, -1);
            }}>
              <Text alignSelf={'center'}>Or specify what everyone owes:</Text>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel>
            <Text alignSelf={'center'} fontSize={'xs'} fontWeight={'light'} mb={3}>
              You can leave the amount for a user empty if you want us to calculate it for you.
            </Text>
            <FormControl id={TransactionFormIds.transactionDetails}
              isInvalid={Boolean(errors[TransactionFormIds.transactionDetails])}>
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
              <FormErrorMessage>{errors[TransactionFormIds.transactionDetails]?.message?.toString()}</FormErrorMessage>
            </FormControl>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      </HStack>
    </FormControl>
  )
}

function FormItemAmountDetailsUser({ index, registerAmount, registerUserId, user }:
  { user: UserBasicData, index: number, registerAmount: string, registerUserId: string }) {
  const { resetField, formState: { errors },unregister, control, register, getValues, clearErrors } = useFormContext()
  
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
              if (value <= 0 && (value !== '' && value !== null)) {
                return 'Amount must be greater than 0'
              }
            }
          }}
          render={({ field: { ref, name, value, onChange, ...restField } }) => (
            <InputGroup variant={"transaction"} w='50%'>
              <InputLeftAddon>
                <MdEuroSymbol size={'0.75rem'} />
              </InputLeftAddon>
              <NumberInput size={'md'} {...restField} variant={'transaction'}
                value={value < 0 ? value : value || ''}
                onChange={(value) => {
                  onChange(value);
                  clearErrors(TransactionFormIds.transactionDetails)
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
      <InputGroup variant={"transaction"}>
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
            <NumberInput w='100%' variant={'transaction'}
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
      <InputGroup variant={"transaction"}>
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
      <InputGroup variant={"transaction"}>
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
      <InputGroup variant={"transaction"}>
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
      <InputGroup variant={"transaction"}>
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
  return (
    <FormControl id={TransactionFormIds.notes} isInvalid={Boolean(errors[TransactionFormIds.notes])} marginTop={8}>
      <HStack>
        <CustomFormIcon icon={MdDriveFileRenameOutline} styleProps={{bg:"orange.600",}}/>
      <InputGroup variant={"transactionNote"}>
        <Textarea {...register(TransactionFormIds.notes, {
          required: false
        })}
          placeholder='Add a note'
          background={"transparent"}
          resize={"none"}
        />
      </InputGroup>
      <FormErrorMessage>{errors[TransactionFormIds.notes]?.message?.toString()}</FormErrorMessage>
      </HStack>
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
  FormItemTransactionStrategy,
  FormItemCategory,
  FormItemSubCategory,
  FormItemDateTime,
  FormItemPaidBy,
  FormItemNote,
  formatDateToString
}