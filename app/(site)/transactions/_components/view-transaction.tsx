import { useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";

import {
  Button,
  Flex,
  useDisclosure,
  DrawerHeader,
  DrawerOverlay,
  DrawerBody,
  Drawer,
  DrawerFooter,
  DrawerCloseButton,
  DrawerContent,
  IconButton,
  ScaleFade,
  HStack,
  Box,
  Stack,
  Text,
} from "@chakra-ui/react"

import {
  Step,
  StepIcon,
  StepIndicator,
  StepSeparator,
  StepStatus,
  Stepper,
  useSteps,
} from '@chakra-ui/react'

import {
  MdChevronLeft as IconPrev,
  MdChevronRight as IconNext,
  MdDelete,
  MdOutlineSync
} from "react-icons/md"

import { FormProvider, useForm } from "react-hook-form";

import {
  type TFormTransaction,
  type TFormTransactionDetails,
  TransactionFormIds,
  FormItemId,
  FormItemAmount,
  FormItemTransactionStrategy,
  FormItemCategory,
  FormItemSubCategory,
  FormItemDateTime,
  FormItemName,
  FormItemPaidBy,
  FormItemNote,
  formatDateToString
} from "./form-items";
import { type GroupWithMembers } from "@/app/_types/model/groups"
import { createTransaction, updateTransaction, deleteTransaction } from "@/app/(site)/transactions/_lib/transactions-service"
import {
  type TCreateTransaction,
  type TCreateTransactionDetails,
  type TUpdateTransaction,
  type TTransactionWithDetails
}
  from "@/app/_types/model/transactions";
import { CustomToast } from "@/app/_components/toast";
import Confirm from "@/app/(site)/_components/confirm";
import { UserBasicData } from "@/app/_types/model/users";

const steps = [
  { title: 'Fill in details' },
  { title: 'Decide how to split' },
]

function processUserDetailsByStrategy(values: TFormTransaction, users: UserBasicData[]): TCreateTransactionDetails[] | string | undefined {
  const strategy = values[TransactionFormIds.strategy] as number;
  const totalAmount = parseFloat(values[TransactionFormIds.amount]);
  const paidById = values[TransactionFormIds.paidById];
  const transactionDetails = values[TransactionFormIds.transactionDetails];
  // Strategy 0: Split equally
  if (strategy === 0) {
    const userAmount = totalAmount / users.length
    return users.map(user => {
      return {
        userId: user.id,
        amount: user.id === paidById ? userAmount : -userAmount
      }
    })
  }
  // Strategy > 0: Assign total amount to user at index [strategy - 1]
  else if (strategy > 0) {
    return users.map(user => {
      switch (user.id) {
        case users[strategy - 1].id:
          return {
            userId: user.id,
            amount: -totalAmount
          }
        case paidById:
          return {
            userId: user.id,
            amount: totalAmount
          }
        default:
          return {
            userId: user.id,
            amount: 0
          }
      }
    })
  }
  // Strategy -1: Custom amounts with validation
  else if (strategy === -1) {
    const selectedUsers = transactionDetails.filter((transactionDetails) => transactionDetails.amount !== undefined)
    const usersWithoutInputAmount = selectedUsers.filter((selectedUser) => (selectedUser.amount === null || selectedUser.amount === ''))
    const sum = transactionDetails.reduce((acc: number, item) => acc + (parseFloat(item.amount) || 0), 0)
    let error: string = '';
    if (selectedUsers.length === 0) {
      error = 'You must select at least one user'
    }
    else if (sum > totalAmount) {
      error = 'The sum of the amounts is greater than the total amount'
    }
    else if (sum === totalAmount && usersWithoutInputAmount.length > 0) {
      error = 'Some users are not participating in the transaction'
    }
    else if (sum < totalAmount && usersWithoutInputAmount.length === 0) {
      error = 'Exact user amounts must add up to total amount'
    }
    if (error) {
      return error
    }
    const remainingAmount = totalAmount - sum;
    const owedAmountPerRemainingUser = remainingAmount / usersWithoutInputAmount.length;
    const userDetails: TCreateTransactionDetails[] = selectedUsers.map((selectedUser) => {
      return {
        userId: selectedUser.userId,
        amount: (selectedUser.amount === '') ? owedAmountPerRemainingUser : parseFloat(selectedUser.amount)
      }
    })
    userDetails.forEach(user => {
      if (user.userId !== values[TransactionFormIds.paidById]) {
        user.amount = user.amount * -1
      }
    })
    return userDetails
  }
}


export default function TransactionView(
  { group, disclosureProps, isOpen, onCloseDrawer, setRefreshTransactions, transactionWithDetails }: {
    group: GroupWithMembers,
    disclosureProps: any,
    isOpen: boolean,
    onCloseDrawer: () => void,
    setRefreshTransactions: React.Dispatch<React.SetStateAction<string>>,
    transactionWithDetails?: TTransactionWithDetails,
  }
) {
  const users = group.users!;
  const { data: sessionData } = useSession();
  const { addToast } = CustomToast();
  const { isOpen: isOpenRemoveTransaction, onOpen: onOpenRemoveTransaction, onClose: onCloseRemoveTransaction } = useDisclosure()

  const { isOpen: isOpenPageTwo, onOpen: onOpenPageTwo, onClose: onClosePageTwo } = useDisclosure(
    { defaultIsOpen: false }
  )
  const { isOpen: isOpenPageOne, onOpen: onOpenPageOne, onClose: onClosePageOne } = useDisclosure(
    { defaultIsOpen: true }
  )

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  })

  const defaultValues: TFormTransaction = useMemo(() => ({
    id: transactionWithDetails?.id || undefined,
    name: transactionWithDetails?.name || '',
    category: transactionWithDetails?.category || 0,
    subCategory: transactionWithDetails?.subCategory || 0,
    amount: transactionWithDetails?.amount.toFixed(2) || '',
    paidAt: transactionWithDetails?.paidAt ? formatDateToString(transactionWithDetails?.paidAt) : formatDateToString(new Date()),
    strategy: transactionWithDetails?.strategy || 0,
    transactionDetails: transactionWithDetails?.transactionDetails.map(detail => {
      return {
        userId: detail.userId,
        amount: (detail.amount < 0 ? detail.amount * -1 : detail.amount).toString()
      }
    }) || [],
    groupId: group.id,
    createdById: transactionWithDetails?.createdById || sessionData!.user.id,
    notes: transactionWithDetails?.notes || '',
    paidById: transactionWithDetails?.paidById || sessionData!.user.id,
  }), [sessionData, group, transactionWithDetails]);

  const methods = useForm<TFormTransaction>({
    values: defaultValues
  });
  const {
    handleSubmit,
    setError,
    formState: { isDirty, isValid }
  } = methods

  async function onSubmit(values: TFormTransaction) {
    console.log('Submitted: ', values)
    const strategy = values[TransactionFormIds.strategy] as number;
    const totalAmount = parseFloat(values[TransactionFormIds.amount]);
    const userDetails: TCreateTransactionDetails[] | string | undefined = processUserDetailsByStrategy(values, users);
    if (typeof userDetails === 'string') {
      setError(TransactionFormIds.transactionDetails, { message: userDetails as string })
      return
    }
    // Build the transaction object
    const transaction: TUpdateTransaction | TCreateTransaction = {
      id: values.id ? values.id : undefined,
      name: values[TransactionFormIds.name],
      amount: totalAmount,
      groupId: group.id,
      strategy: strategy,
      createdById: sessionData!.user.id,
      paidById: values[TransactionFormIds.paidById],
      subCategory: values[TransactionFormIds.subCategory],
      category: values[TransactionFormIds.category],
      paidAt: new Date(values[TransactionFormIds.paidAt]!).toISOString(),
      transactionDetails: userDetails!,
      notes: values[TransactionFormIds.notes]
    }
    if (values.id) {
      console.log('Updating transaction', transaction)
      const response = await updateTransaction(transaction as TUpdateTransaction);
      if (response.success) {
        onCloseDrawer();
        setRefreshTransactions(Date.now().toString());
      }
      else {
        addToast("Error updating transaction", response.error, "error")
      }
    }
    else {
      console.log('Creating transaction', transaction)
      const response = await createTransaction(transaction as TCreateTransaction);
      if (response.success) {
        onCloseDrawer();
        setRefreshTransactions(Date.now().toString());
      }
      else {
        addToast("Error creating transaction", response.error, "error")
      }
    }
    return
  }

  async function onRemoveTransaction(id: number) {
    const res = await deleteTransaction({ id: id, groupId: group!.id, userId: sessionData!.user.id })
    if (res.success) {
      addToast(`Transaction removed`, null, 'success')
      setRefreshTransactions(Date.now().toString())
      onCloseDrawer();
    }
    else {
      addToast('Cannot delete transaction.', res.error, 'error')
    }
  }

  return (
    <Drawer
      size={'md'}
      placement="bottom"
      variant={'transaction'}
      isOpen={isOpen}
      onClose={() => { onCloseDrawer(), onClosePageTwo(), onOpenPageOne() }}
      {...disclosureProps}>
      <DrawerOverlay />
      <DrawerContent height='100vh' width={{ base: '100%', md: 'lg', lg: 'xl' }} margin='auto'>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DrawerHeader
              color={'whiteAlpha.580'}
              textAlign={'center'}>
              {transactionWithDetails ? 'Edit Transaction' : 'Add Transaction'}
              <Stack letterSpacing={'wide'} fontWeight={400}>
                <Stepper index={activeStep} size={'sm'} colorScheme="green">
                  {steps.map((step, index) => (
                    <Step key={index}>
                      <StepIndicator>
                        <StepStatus
                          complete={<StepIcon />}
                        />
                      </StepIndicator>
                      <StepSeparator />
                    </Step>
                  ))}
                </Stepper>
                <HStack justifyContent={'center'} fontSize={'sm'} pt={0} mt={-2}>
                  <Text textColor={'whiteAlpha.700'} letterSpacing={'wide'} fontWeight={300}>
                    Step {activeStep + 1}:
                  </Text>
                  <Text>{steps[activeStep].title}</Text>
                </HStack>
              </Stack>
              <DrawerCloseButton />
            </DrawerHeader>
            <DrawerBody overflow={'auto'} height='90vh' paddingBottom={'30vh'}>
              <ScaleFade in={isOpenPageOne}>
                <Flex direction={'column'} display={isOpenPageTwo ? 'none' : 'flex'}>
                  <FormItemId />
                  <FormItemName />
                  <FormItemDateTime />
                  <FormItemCategory />
                  <FormItemSubCategory />
                  <FormItemPaidBy {...{ users: users }} />
                  <FormItemAmount />
                  <FormItemNote />
                </Flex>
              </ScaleFade>
              <ScaleFade in={isOpenPageTwo}>
                <Flex direction={'column'} display={isOpenPageOne ? 'none' : 'flex'}>
                  <FormItemTransactionStrategy {...{ users: users, transactionDetails: transactionWithDetails?.transactionDetails }} />
                </Flex>
              </ScaleFade>
            </DrawerBody>
            <DrawerFooter position={'absolute'}
              zIndex={1700}
              w={'100%'}
              borderTopWidth={1}
              borderTopColor={'whiteAlpha.200'}
              h='10vh'
              overflow={'hidden'}
              bottom={0}>
              <HStack justifyContent={'space-around'} w='100%'>
                {transactionWithDetails ?
                  <>
                    <Button size={'sm'} w={'25%'}
                      leftIcon={<MdDelete size={'1rem'} />}
                      textAlign={'center'} variant={'delete'}
                      onClick={onOpenRemoveTransaction}>Delete</Button>
                    <Confirm isOpen={isOpenRemoveTransaction} onClose={onCloseRemoveTransaction} callback={() => {
                      onRemoveTransaction(transactionWithDetails.id); onCloseRemoveTransaction();
                    }} mode="removeTransaction" />
                  </> : <Box w={'30%'} />
                }
                <HStack w={'50%'} justifyContent={'center'}>
                  <IconButton
                    variant={'formNavigation'}
                    aria-label="Back"
                    icon={<IconPrev />}
                    isDisabled={isOpenPageOne}
                    onClick={() => { setActiveStep(0), onClosePageTwo(), onOpenPageOne() }} />
                  <IconButton
                    variant={'formNavigation'}
                    aria-label="Next"
                    icon={<IconNext />}
                    isDisabled={isOpenPageTwo}
                    onClick={() => { setActiveStep(1), onClosePageOne(), onOpenPageTwo() }} />
                </HStack>
                <Button size={'sm'} w={'25%'}
                  leftIcon={<MdOutlineSync size={'1rem'} />}
                  variant={transactionWithDetails ? 'update' : 'add'}
                  isDisabled={!isValid || !isDirty || isOpenPageOne}
                  isLoading={methods.formState.isSubmitting} type='submit'>
                  {transactionWithDetails ? 'Update' : 'Add'}
                </Button>
              </HStack>
            </DrawerFooter>
          </form>
        </FormProvider>
      </DrawerContent>
    </Drawer>
  )
}