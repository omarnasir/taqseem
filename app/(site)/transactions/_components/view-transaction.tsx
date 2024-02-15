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
import { MdDelete } from "react-icons/md"

import {
  type TFormIds,
  FormIds,
  FormItemId,
  FormItemAmount,
  FormItemAmountDetails,
  FormItemCategory,
  FormItemSubCategory,
  FormItemDateTime,
  FormItemName,
  FormItemPaidBy,
  FormItemNote,
  processAmountDetails,
  formatDateToString
} from "./form-items";
import { type GroupWithMembers } from "@/app/_types/model/groups"
import { createTransaction, deleteTransaction } from "@/app/(site)/transactions/_lib/transactions-service"
import { CreateTransactionWithDetails, TransactionWithDetails } from "@/app/_types/model/transactions";
import { CustomToast } from "@/app/_components/toast";
import Confirm from "@/app/(site)/_components/confirm";
import { useEffect } from "react";


export default function TransactionView(
  { group, disclosureMethods, setRefreshTransactions, transactionWithDetails}: {
    group: GroupWithMembers,
    disclosureMethods: { onClose: () => void, isOpen: boolean },
    setRefreshTransactions: React.Dispatch<React.SetStateAction<string>>,
    transactionWithDetails?: TransactionWithDetails,
  }
) {
  console.log('TransactionView', transactionWithDetails)
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

  const defaultValues = {
    id: transactionWithDetails?.id || undefined,
    name: transactionWithDetails?.name || '',
    category: transactionWithDetails?.category || 0,
    subcategory: transactionWithDetails?.subCategory || 0,
    amount: transactionWithDetails?.amount.toString() || '0',
    paidAt: transactionWithDetails?.paidAt || formatDateToString(new Date()),
    amountDetails: transactionWithDetails?.transactionDetails,
    everyone: true,
    note: transactionWithDetails?.notes,
    paidBy: transactionWithDetails?.paidById
  }

  const methods = useForm<TFormIds>(
    {
      defaultValues: {
        id: undefined,
        name: '',
        category: 0,
        subcategory: 0,
        amount: '0',
        paidAt: formatDateToString(new Date()),
        amountDetails: [],
        everyone: true,
        note: '',
        paidBy: group.users![0].id
      }
    })
  const {
    handleSubmit,
    reset
  } = methods

  useEffect(() => {
    if (transactionWithDetails) {
      reset({
        name: transactionWithDetails.name,
        category: transactionWithDetails.category,
        subcategory: transactionWithDetails.subCategory,
        amount: transactionWithDetails.amount.toString(),
        paidAt: formatDateToString(transactionWithDetails.paidAt),
        amountDetails: transactionWithDetails.transactionDetails.map(detail => {
          return {
            userId: detail.userId,
            amount: detail.amount.toString()
          }
        }),
        everyone: false,
        note: transactionWithDetails.notes || '',
        paidBy: transactionWithDetails.paidById,
      })
    }
  }, [transactionWithDetails, reset]);

  async function onSubmit(values: TFormIds) {
    const everyone = values[FormIds.everyone] as boolean;
    const totalAmount = parseFloat(values[FormIds.amount]);
    let userDetails: CreateTransactionWithDetails['transactionDetails']
    if (everyone) {
      const userAmount = totalAmount / group.users!.length
      userDetails = group.users!.map(user => {
        return {
          userId: user.id,
          amount: userAmount
        }
      })
    }
    else {
      const amountDetails = values[FormIds.amountDetails] as TFormIds[FormIds.amountDetails];
      const { selectedUsers, usersWithoutInputAmount, sum } = processAmountDetails(amountDetails)
      const remainingAmount = totalAmount - sum;
      const owedAmountPerRemainingUser = remainingAmount / usersWithoutInputAmount.length;
      userDetails = selectedUsers.map((selectedUser) => {
        return {
          userId: selectedUser.id,
          amount: (selectedUser.amount === null) ? owedAmountPerRemainingUser : parseFloat(selectedUser.amount)
        }
      })
    }
    // Multiply the non-paying user's amount by -1 to indicate that they are paying
    userDetails = userDetails.map(user => {
      if (user.userId !== values[FormIds.paidBy]) {
        user.amount *= -1;
      }
      return user;
    })
    if (transactionWithDetails) {
      console.log('Edit', userDetails, values[FormIds.id])
    }
    else {
      const response = await createTransaction({
        name: values[FormIds.name],
        amount: totalAmount,
        groupId: group.id,
        createdById: sessionData!.user.id,
        paidById: values[FormIds.paidBy],
        subCategory: values[FormIds.subcategory],
        category: values[FormIds.category],
        paidAt: new Date(values[FormIds.paidAt]).toISOString(),
        transactionDetails: userDetails,
        notes: values[FormIds.note]
      })
      if (response.success) {
        reset();
        onClose();
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
            <FormItemPaidBy {...{ users: group.users! }} />
            <FormItemAmount />
            <FormItemAmountDetails {...{ users: group.users! }} />
            <FormItemNote />
          </ModalBody>
          <ModalFooter>
            <Flex direction={'row'} justifyContent={'space-between'} w='100%'>
              <Button size={'sm'} fontWeight={'400'} w={'7rem'}
                textAlign={'center'} variant={'outline'} textColor='whiteAlpha.600'
                onClick={() => reset()}>
                Clear
              </Button>
              {transactionWithDetails &&
                <>
                  <Button size={'sm'} fontWeight={'400'} w={'7rem'}
                    textAlign={'center'} variant={'remove'} textColor='whiteAlpha.600'
                    onClick={onOpenRemoveTransaction}>
                    <MdDelete size={20} />
                  </Button>
                  <Confirm isOpen={isOpenRemoveTransaction} onClose={onCloseRemoveTransaction} callback={() => {
                    onRemoveTransaction(transactionWithDetails.id); onCloseRemoveTransaction();
                  }} mode="removeTransaction" />
                </>}
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