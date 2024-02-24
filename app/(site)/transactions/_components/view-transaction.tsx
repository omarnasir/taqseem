import { useEffect, useMemo, useState } from "react";
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
  Slide,
  ScaleFade,
  Fade,
  SlideFade,
  HStack,
  Box,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react"

import {
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
} from '@chakra-ui/react'

import {
  MdArrowCircleLeft,
  MdArrowCircleRight,
  MdDelete
} from "react-icons/md"

import { FormProvider, useForm } from "react-hook-form";

import {
  type TFormTransaction,
  type TFormTransactionDetails,
  TransactionFormIds,
  FormItemId,
  FormItemAmount,
  FormItemTransactionDetails,
  FormItemCategory,
  FormItemSubCategory,
  FormItemDateTime,
  FormItemName,
  FormItemPaidBy,
  FormItemNote,
  processTransactionDetails,
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

const steps = [
  { title: 'Fill in details' },
  { title: 'Decide how to split' },
]

export default function TransactionView(
  { group, disclosureProps, isOpen, onClose, setRefreshTransactions, transactionWithDetails }: {
    group: GroupWithMembers,
    disclosureProps: any,
    isOpen: boolean,
    onClose: (callback: any, callbackProps?: any) => void,
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

  async function onRemoveTransaction(id: number) {
    const res = await deleteTransaction({ id: id, groupId: group!.id, userId: sessionData!.user.id })
    if (res.success) {
      addToast(`Transaction removed`, null, 'success')
      setRefreshTransactions(Date.now().toString())
      onClose(reset, defaultValues);
    }
    else {
      addToast('Cannot delete transaction.', res.error, 'error')
    }
  }

  const defaultValues: TFormTransaction = useMemo(() => ({
    id: transactionWithDetails?.id || undefined,
    name: transactionWithDetails?.name || '',
    category: transactionWithDetails?.category || 0,
    subCategory: transactionWithDetails?.subCategory || 0,
    amount: transactionWithDetails?.amount.toFixed(2) || '0',
    paidAt: transactionWithDetails?.paidAt ? formatDateToString(transactionWithDetails?.paidAt) : formatDateToString(new Date()),
    everyone: transactionWithDetails?.id ? false : true,
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
    reset,
    formState: { isDirty, isValid }
  } = methods

  async function onSubmit(values: TFormTransaction) {
    console.log('called')
    const everyone = values[TransactionFormIds.everyone] as boolean;
    const totalAmount = parseFloat(values[TransactionFormIds.amount]);
    let userDetails: TCreateTransactionDetails[];
    if (everyone) {
      const userAmount = totalAmount / users.length
      userDetails = users.map(user => {
        return {
          userId: user.id,
          amount: userAmount
        }
      })
    }
    else {
      const transactionDetails = values[TransactionFormIds.transactionDetails] as TFormTransactionDetails[];
      const { selectedUsers, usersWithoutInputAmount, sum } = processTransactionDetails(transactionDetails)
      const remainingAmount = totalAmount - sum;
      const owedAmountPerRemainingUser = remainingAmount / usersWithoutInputAmount.length;
      userDetails = selectedUsers.map((selectedUser) => {
        return {
          userId: selectedUser.userId,
          amount: (selectedUser.amount === null) ? owedAmountPerRemainingUser : parseFloat(selectedUser.amount)
        }
      })
    }
    // Multiply the non-paying user's amount by -1 to indicate that they are paying
    userDetails = userDetails.map(user => {
      if (user.userId !== values[TransactionFormIds.paidById]) {
        user.amount *= -1;
      }
      return user;
    })
    // Build the transaction object
    const transaction: TUpdateTransaction | TCreateTransaction = {
      id: values.id ? values.id : undefined,
      name: values[TransactionFormIds.name],
      amount: totalAmount,
      groupId: group.id,
      createdById: sessionData!.user.id,
      paidById: values[TransactionFormIds.paidById],
      subCategory: values[TransactionFormIds.subCategory],
      category: values[TransactionFormIds.category],
      paidAt: new Date(values[TransactionFormIds.paidAt]!).toISOString(),
      transactionDetails: userDetails,
      notes: values[TransactionFormIds.notes]
    }
    if (values.id) {
      const response = await updateTransaction(transaction as TUpdateTransaction);
      if (response.success) {
        onClose(reset, defaultValues);
        setRefreshTransactions(Date.now().toString());
      }
      else {
        addToast("Error updating transaction", response.error, "error")
      }
    }
    else {
      const response = await createTransaction(transaction as TCreateTransaction);
      if (response.success) {
        onClose(reset, defaultValues);
        setRefreshTransactions(Date.now().toString());
      }
      else {
        addToast("Error creating transaction", response.error, "error")
      }
    }
    return
  }

  return (
    <FormProvider {...methods}>
      <Drawer
        size={'md'}
        placement="bottom"
        variant={'transaction'}
        isOpen={isOpen}
        onClose={() => { onClose(reset, defaultValues), onClosePageTwo(), onOpenPageOne() }}
        {...disclosureProps}>
        <DrawerOverlay />
        <DrawerContent height='100vh' width={{ base: '100%', md: 'lg', lg: 'xl' }} margin='auto'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DrawerHeader fontSize={'md'} letterSpacing={'wide'} fontWeight={400}
              color={'whiteAlpha.580'}
              textAlign={'center'}>
              {transactionWithDetails ? 'Edit Transaction' : 'Add Transaction'}
              <DrawerCloseButton />
            </DrawerHeader>
            <DrawerBody overflow={'auto'} height='90vh' paddingBottom={'30vh'}>
              <Stack>
              <Stepper index={activeStep} size={'sm'} colorScheme="green">
                {steps.map((step, index) => (
                  <Step key={index}>
                    <StepIndicator gap={'0'}>
                      <StepStatus
                        complete={<StepIcon />}
                      />
                    </StepIndicator>
                    <StepSeparator />
                  </Step>
                ))}
                </Stepper>
                <HStack justifyContent={'center'}>
                  <Text textColor={'whiteAlpha.700'} letterSpacing={'wide'} fontWeight={300}>
                    Step {activeStep + 1}:
                  </Text>
                  <Text>{steps[activeStep].title}</Text>
                </HStack>
              </Stack>
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
                  <FormItemTransactionDetails {...{ users: users, transactionDetails: transactionWithDetails?.transactionDetails }} />
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
                    <IconButton size={'xs'} fontWeight={'600'} w={'20%'}
                      aria-label="Delete"
                      as={MdDelete}
                      textAlign={'center'} variant={'delete'}
                      onClick={onOpenRemoveTransaction} />
                    <Confirm isOpen={isOpenRemoveTransaction} onClose={onCloseRemoveTransaction} callback={() => {
                      onRemoveTransaction(transactionWithDetails.id); onCloseRemoveTransaction();
                    }} mode="removeTransaction" />
                  </> : <Box w={'20%'} />
                }
                <HStack w={'55%'} justifyContent={'center'}>
                  <IconButton size={'sm'} w={'3rem'} fontWeight={'600'}
                    variant={'formNavigation'}
                    aria-label="Back"
                    as={MdArrowCircleLeft}
                    isDisabled={isOpenPageOne}
                    onClick={() => { setActiveStep(0), onClosePageTwo(), onOpenPageOne() }} />
                  <IconButton size={'sm'} w={'3rem'} fontWeight={'600'}
                    variant={'formNavigation'}
                    aria-label="Next"
                    as={MdArrowCircleRight}
                    isDisabled={isOpenPageTwo}
                    onClick={() => { setActiveStep(1), onClosePageOne(), onOpenPageTwo() }} />
                </HStack>
                <Button size={'sm'} w={'25%'} fontWeight={'600'}
                  variant={transactionWithDetails ? 'update' : 'add'}
                  isDisabled={!isValid || !isDirty}
                  isLoading={methods.formState.isSubmitting} type='submit'>
                  {transactionWithDetails ? 'Update' : 'Add'}
                </Button>
              </HStack>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    </FormProvider>
  )
}