import { useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";

import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Divider,
  Flex,
  HStack,
  useDisclosure,
} from "@chakra-ui/react"

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
import { createTransaction, deleteTransaction } from "@/app/(site)/transactions/_lib/transactions-service"
import { type TCreateTransaction, type TCreateTransactionDetails, type TTransactionWithDetails } from "@/app/_types/model/transactions";
import { CustomToast } from "@/app/_components/toast";
import Confirm from "@/app/(site)/_components/confirm";


export default function TransactionView(
  { group, disclosureMethods, setRefreshTransactions, transactionWithDetails}: {
    group: GroupWithMembers,
    disclosureMethods: { onClose: () => void, isOpen: boolean },
    setRefreshTransactions: React.Dispatch<React.SetStateAction<string>>,
    transactionWithDetails?: TTransactionWithDetails,
  }
) {
  const users = group.users!;
  const { data: sessionData } = useSession();
  const { addToast } = CustomToast();
  const { isOpen, onClose } = disclosureMethods
  const { isOpen: isOpenRemoveTransaction, onOpen: onOpenRemoveTransaction, onClose: onCloseRemoveTransaction } = useDisclosure()

  async function onRemoveTransaction(id: number) {
    const res = await deleteTransaction({ id: id, groupId: group!.id, userId: sessionData!.user.id })
    if (res.success) {
      addToast(`Transaction removed`, null, 'success')
      setRefreshTransactions(Date.now().toString())
      onClose();
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
        amount: detail.amount.toString()
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
  } = methods

  async function onSubmit(values: TFormTransaction) {
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
    if (values.id) {
      console.log('Edit', userDetails)
    }
    else {
      console.log('Create', {
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
        })
      // const response = await createTransaction({
      //   name: values[FormIds.name],
      //   amount: totalAmount,
      //   groupId: group.id,
      //   createdById: sessionData!.user.id,
      //   paidById: values[FormIds.paidById],
      //   subCategory: values[FormIds.subCategory],
      //   category: values[FormIds.category],
      //   paidAt: new Date(values[FormIds.paidAt]).toISOString(),
      //   transactionDetails: userDetails,
      //   notes: values[FormIds.notes]
      // })
      // if (response.success) {
      //   reset();
      //   onClose();
      //   setRefreshTransactions(Date.now().toString());
      // }
      // else {
      //   addToast("Error creating transaction", response.error, "error")
      // }
    }
    return
  }

  return (
    <FormProvider {...methods}>
      <Modal
        blockScrollOnMount={false}
        isOpen={isOpen}
        onClose={onClose}
        size={{ xl: 'lg', base: 'lg', "2xl": 'xl' }}>
        <ModalOverlay />
        <ModalContent marginX={2}
          as='form' onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader
            textAlign={'left'}
            fontSize={'lg'}
            fontWeight={'bold'}>New transaction</ModalHeader>
          <Divider />
          <ModalCloseButton />
          <ModalBody>
            <FormItemId />
            <FormItemName />
            <FormItemDateTime />
            <HStack>
              <FormItemCategory />
              <FormItemSubCategory />
            </HStack>
            <FormItemPaidBy {...{ users: users }} />
            <FormItemAmount />
            <FormItemTransactionDetails {...{ users: users, transactionDetails: transactionWithDetails?.transactionDetails }} />
            <FormItemNote />
          </ModalBody>
          <ModalFooter>
            <Flex direction={'row'} justifyContent={'space-between'} w='100%'>
              {transactionWithDetails ?
                <>
                  <Button size={'sm'} fontWeight={'600'} w={'7rem'}
                    textAlign={'center'} variant={'delete'}
                    onClick={onOpenRemoveTransaction}>
                    Delete
                  </Button>
                  <Confirm isOpen={isOpenRemoveTransaction} onClose={onCloseRemoveTransaction} callback={() => {
                    onRemoveTransaction(transactionWithDetails.id); onCloseRemoveTransaction();
                  }} mode="removeTransaction" />
                </> :
                <Button size={'sm'} fontWeight={'400'} w={'7rem'}
                  textAlign={'center'} variant={'outline'} textColor='whiteAlpha.600'
                  onClick={() => reset(defaultValues)}>
                  Clear
                </Button>}
              <Button size={'sm'} w={'7rem'} fontWeight={'600'}
                variant={'add'} textColor='black'
                isLoading={methods.formState.isSubmitting} type='submit'>
                Add
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </FormProvider>
  )
}