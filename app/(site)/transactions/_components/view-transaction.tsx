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
} from "@chakra-ui/react"
import {
  MdArrowCircleLeft,
  MdArrowCircleRight
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
    amount: transactionWithDetails?.amount.toString() || '0',
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
        <DrawerContent height='92vh' width={{ base: '100%', md: 'lg', lg:'xl' }} margin='auto'>
        <Flex as='form'
         direction={'column'} onSubmit={handleSubmit(onSubmit)}>
          <DrawerHeader fontSize={'md'} letterSpacing={'wide'} fontWeight={400}
            color={'whiteAlpha.580'}
            borderBottomWidth={1}
            textAlign={'center'}
            borderColor={transactionWithDetails ? 'orange.500' : 'teal.500'}>
            {transactionWithDetails ? 'Edit Transaction' : 'Add Transaction'}
            <DrawerCloseButton />
          </DrawerHeader>
          <DrawerBody>
            <ScaleFade in={isOpenPageOne}>
              <Flex direction={'column'}
                display={isOpenPageTwo ? 'none' : 'flex'}>
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
              <Flex direction={'column'}
                display={isOpenPageOne ? 'none' : 'flex'}
              >
                <FormItemTransactionDetails {...{ users: users, transactionDetails: transactionWithDetails?.transactionDetails }} />
              </Flex>
            </ScaleFade>
          </DrawerBody>
          <DrawerFooter>
            <Flex direction={'row'} justifyContent={'flex-end'} mb={4}
              position={'fixed'}
              bottom={16}
              right={0}
              left={0}
              zIndex={999}
            >
              <IconButton size={'md'} w={'3rem'} fontWeight={'600'}
                variant={'formNavigation'}
                aria-label="Back"
                as={MdArrowCircleLeft}
                isDisabled={!isOpenPageTwo}
                onClick={() => {
                  if (isOpenPageTwo) {
                    onClosePageTwo();
                    onOpenPageOne();
                  }
                }}>
                Back
              </IconButton>
              <IconButton size={'md'} w={'3rem'} fontWeight={'600'}
                variant={'formNavigation'}
                aria-label="Next"
                as={MdArrowCircleRight}
                isDisabled={!isOpenPageOne}
                onClick={() => {
                  if (isOpenPageOne) {
                    onClosePageOne();
                    onOpenPageTwo();
                  }
                }}>
                Next
              </IconButton>
            </Flex>
          </DrawerFooter>
          <DrawerFooter>
            <Flex direction={'row'} justifyContent={'space-between'}
              position={'fixed'}
              bottom={16}
              right={0}
              left={0}
              borderTopWidth={1}
              borderTopColor={'whiteAlpha.200'}
            >
              {transactionWithDetails &&
                <Button size={'md'} fontWeight={'600'} w={'7rem'}
                  textAlign={'center'} variant={'delete'}
                  position={'fixed'}
                  left={4}
                  bottom={4}
                  onClick={onOpenRemoveTransaction}>
                  Delete
                  <Confirm isOpen={isOpenRemoveTransaction} onClose={onCloseRemoveTransaction} callback={() => {
                    onRemoveTransaction(transactionWithDetails.id); onCloseRemoveTransaction();
                  }} mode="removeTransaction" />
                </Button>
              }
              <Button size={'md'} w={'7rem'} fontWeight={'600'}
                variant={transactionWithDetails ? 'update' : 'add'}
                position={'fixed'}
                right={4}
                bottom={4}
                isDisabled={!isValid || !isDirty}
                isLoading={methods.formState.isSubmitting} type='submit'>
                {transactionWithDetails ? 'Update' : 'Add'}
              </Button>
            </Flex>
          </DrawerFooter>
        </Flex>
        </DrawerContent>
      </Drawer>
    </FormProvider>
  )
}