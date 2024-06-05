import React, { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
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
  Radio, 
  RadioGroup,
  FormControl,
  FormErrorMessage,
  InputRightElement,
  InputLeftAddon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  InputLeftElement,
  FormLabel,
} from "@chakra-ui/react";
import {
  MdEuroSymbol, MdDriveFileRenameOutline, MdCategory,
  MdCalendarMonth, MdOutlineCategory, MdOutlineCancel
} from "react-icons/md"
import { useFormContext, useFieldArray, Controller, useWatch } from "react-hook-form";

import { UserBasicData } from "@/app/_types/model/users";
import { TransactionCategoryEnum, TransactionSubCategoryEnum } from "@/app/_lib/db/constants";
import { FormIdEnum, formatDateToString } from "./transaction";
import { CustomFormIcon } from "@/app/(site)/_components/cardIcon";


function FormItemId() {
  const { formState: { errors }, register } = useFormContext()
  return (
    <FormControl id={FormIdEnum.id} isInvalid={Boolean(errors[FormIdEnum.id])}>
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
    <FormControl id={FormIdEnum.name} isInvalid={Boolean(errors[FormIdEnum.name])} marginBottom={3}>
      <FormLabel variant={'transaction'}>Name</FormLabel>
      <InputGroup variant={"transaction"}>
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

function TransactionStrategyDecisionRadio({ user, value, amount }: { user: UserBasicData, value: string, amount: number}) {
  const { data: sessionData } = useSession();

  const isUserSessionUser = useMemo(() => user.id === sessionData?.user?.id!, [user.id, sessionData?.user?.id!]);
  const variant = useMemo(() => isUserSessionUser ? 'transactionStrategyYou' : 'transactionStrategyThem', [isUserSessionUser]);
  
  return (
    <Radio variant={variant} value={value}>{isUserSessionUser ? 'You owe' : user.name + ' pays'} €{amount.toFixed(2)}
    </Radio>
  )
}

function FormItemTransactionStrategy({ users } : { users: UserBasicData[],  }) 
{
  const { formState: { errors },
    control,
    setValue,
    getValues } = useFormContext()
  const { fields, replace, update, remove } = useFieldArray({
    control,
    name: FormIdEnum.transactionDetails,
  })
  const strategy = useWatch({
    control,
    name: FormIdEnum.strategy,
  });

  const amount = useWatch({
    control,
    name: FormIdEnum.amount,
  });

  const [radioStrategyValue, setRadioStrategyValue] = React.useState(strategy.toString());

  return (
    <FormControl id={FormIdEnum.strategy} isInvalid={Boolean(errors[FormIdEnum.strategy])} marginBottom={3}>
      <HStack>
        <Accordion width={'100%'} defaultIndex={strategy === -1 ? [1] : [0]} variant='transaction'>
          <AccordionItem>
            <h2>
              <AccordionButton onClick={() => {
                remove()
                setValue(FormIdEnum.strategy, 0);
              }}
              >
                <Text alignSelf={'center'}>Based on People</Text>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel>
              <VStack width={'100%'} spacing={3}>
                <RadioGroup onChange={(e) => {
                  remove();
                  setValue(FormIdEnum.strategy, parseInt(e.toString()));
                  setRadioStrategyValue(e.toString());
                }
                } value={radioStrategyValue} w={'100%'}>
                  <VStack>
                    <Radio value="0" variant={'transactionStrategyEveryone'}>Everyone pays €{(parseFloat(amount || 0) / users.length).toFixed(2)}</Radio>
                    {users.map((user, index) =>
                      user.id !== getValues(FormIdEnum.paidById) &&
                      <TransactionStrategyDecisionRadio key={user.id} value={(index + 1).toString()} user={user} amount={parseFloat(amount || 0)} />
                    )}
                  </VStack>
                </RadioGroup>
              </VStack>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <h2>
              <AccordionButton onClick={() => {
                replace(users.map(user => ({
                  userId: user.id,
                  amount: ''
                }
                )));
                setValue(FormIdEnum.strategy, -1);
              }}>
                <Text alignSelf={'center'}>Or specify what everyone owes:</Text>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel>
              <Text alignSelf={'center'} fontSize={'xs'} fontWeight={'light'} mb={3}>
                You can leave the amount for a user empty if you want us to calculate it for you.
              </Text>
              <FormControl id={FormIdEnum.transactionDetails}
                isInvalid={Boolean(errors[FormIdEnum.transactionDetails])}>
                <VStack alignItems={'center'} marginX={1}>
                  {fields.map((field, index) => (
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
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </HStack>
    </FormControl>
  )
}

function FormItemAmountDetailsUser({ index, update, value, control, user }:
  { user: UserBasicData, index: number, control: any, update: any, value: any }) {
  const { clearErrors, getFieldState } = useFormContext()
  
  const registerAmount = useMemo(() => `${FormIdEnum.transactionDetails}.${index}.amount`, [index]);

  const [selected, setSelected] = useState<boolean>(value.amount !== undefined)

  return (
    <FormControl id={registerAmount}
      isInvalid={getFieldState(registerAmount).invalid}>
      <HStack>
        <Checkbox onChange={(e) => {
          setSelected(e.target.checked);
          if (!e.target.checked) update(index, { ...value, amount: undefined });
          else update(index, { ...value, amount: '' });
        }}
          defaultChecked={selected}
          colorScheme={'gray'}
          variant={'transactionDetailsUser'}
          rounded='full'
          size={'lg'}
          w='50%'>
          <Text>{user.name}</Text>
        </Checkbox>
        <InputGroup variant={"transaction"} w='50%'>
          <InputLeftAddon>
            <MdEuroSymbol size={'0.75rem'} />
          </InputLeftAddon>
          <Controller
            name={registerAmount}
            control={control}
            disabled={!selected}
            rules={{
              required: false,
              validate: (value) => value > 0 || value === ''
            }}
            render={({ field: { ref, name,onChange, ...restField } }) => (
              <NumberInput size={'md'} variant={'transactionUserDetails'}
                {...restField} 
                onChange={(value) =>{
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
                  textIndent={'0.5rem'}
                />
                <InputRightElement color={'gray.500'}
                  onClick={() => update(index, {...value, amount: ''})}>
                  <MdOutlineCancel size={'1rem'} />
                </InputRightElement>
              </NumberInput>)} />
        </InputGroup>
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
    <FormControl id={FormIdEnum.amount} isInvalid={Boolean(errors[FormIdEnum.amount])} marginBottom={3}>
      <FormLabel variant={'transaction'}>Amount</FormLabel>
      <InputGroup variant={"transaction"}>
      <InputLeftElement>
        <CustomFormIcon icon={MdEuroSymbol} styleProps={{color:"green.600"}}/>
      </InputLeftElement>
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
      <FormErrorMessage>{errors[FormIdEnum.amount]?.message?.toString()}</FormErrorMessage>
    </FormControl>
  )
}

function FormItemSubCategory() {
  const { formState: { errors }, register } = useFormContext()
  return (
    <FormControl id={FormIdEnum.subCategory} isInvalid={Boolean(errors[FormIdEnum.subCategory])} marginBottom={3}>
      <FormLabel variant={'transaction'}>SubCategory</FormLabel>
      <InputGroup variant={"transaction"}>
      <InputLeftElement>
        <CustomFormIcon icon={MdOutlineCategory} styleProps={{color:"red.600"}}/>
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
  return (
    <FormControl id={FormIdEnum.category} isInvalid={Boolean(errors[FormIdEnum.category])} marginBottom={3}>
      <FormLabel variant={'transaction'}>Category</FormLabel>
      <InputGroup variant={"transaction"}>
        <InputLeftElement>
        <CustomFormIcon icon={MdCategory} styleProps={{color:"red.600"}}/>
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
    <FormControl id={FormIdEnum.paidAt} isInvalid={Boolean(errors[FormIdEnum.paidAt])} marginBottom={3}>
      <FormLabel variant={'transaction'}>Date</FormLabel>
      <InputGroup variant={"transaction"}>
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
    <FormControl id={FormIdEnum.paidById} isInvalid={Boolean(errors[FormIdEnum.paidById])} marginBottom={3}>
          <FormLabel variant={'transaction'}>Paid By</FormLabel>
      <InputGroup variant={"transaction"}>
        <InputLeftElement>
          <CustomFormIcon icon={MdCategory} styleProps={{color:"purple.600"}}/>
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
    <FormControl id={FormIdEnum.notes} isInvalid={Boolean(errors[FormIdEnum.notes])} marginBottom={3}>
      <FormLabel variant={'transaction'}>Note</FormLabel>
        <InputGroup variant={"transaction"}>
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


export {
  FormItemId,
  FormItemName,
  FormItemAmount,
  FormItemTransactionStrategy,
  FormItemCategory,
  FormItemSubCategory,
  FormItemDateTime,
  FormItemPaidBy,
  FormItemNote
}