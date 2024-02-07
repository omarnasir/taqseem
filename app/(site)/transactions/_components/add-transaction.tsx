import { useRouter } from 'next/navigation'

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
} from "@chakra-ui/react"

import { FormProvider, useForm } from "react-hook-form";

import { 
  type TFormIds,
  FormIds,
  FormItemAmount, 
  FormItemAmountDetails, 
  FormItemCategory, 
  FormItemSubCategory,
  FormItemDateTime,
  FormItemName,
  FormItemPaidBy,
  processAmountDetails,
  getCurrentDate,
  FormItemNote
} from "./form-items";
import { type GroupWithMembers } from "@/app/_types/model/groups"
import { createTransaction } from "@/app/(site)/transactions/_lib/transactions-service"
import { CreateTransactionWithDetails } from "@/app/_types/model/transactions";
import { useSession } from "next-auth/react";
import { CustomToast } from "@/app/_components/toast";

export default function AddTransaction(
  { group, onClose, isOpen, setRefreshTransactions }: { group: GroupWithMembers,
    onClose: () => void, isOpen: boolean, setRefreshTransactions: React.Dispatch<React.SetStateAction<string>> }
) {
  const router = useRouter()
  const { data: sessionData } = useSession();
  
  const { addToast } = CustomToast();

  const methods = useForm<TFormIds>({
    defaultValues: {
      name: '',
      category: 0,
      subcategory: 0,
      amount: '0',
      paidAt: getCurrentDate(),
      amountDetails: [],
      everyone: true,
      note: '',
      paidBy: group.users![0].id
    }
  })
  const {
    handleSubmit,
    reset,
  } = methods

  async function onSubmit(values: TFormIds) {
    const everyone = values[FormIds.everyone] as boolean;
    const totalAmount = parseFloat(values[FormIds.amount]);
    let userDetails : CreateTransactionWithDetails['transactionDetails']
    if (everyone) {
      userDetails = group.users!.map(user => {
        return {
          userId: user.id,
          amount: totalAmount / group.users!.length
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
    const response = await createTransaction({
      name: values[FormIds.name],
      amount: totalAmount,
      groupId: group.id,
      createdById: sessionData!.user.id,
      paidById: values[FormIds.paidBy],
      subCategory: values[FormIds.subcategory],
      category: values[FormIds.category],
      paidAt: values[FormIds.paidAt],
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
              <Button size={'sm'} fontWeight={'400'}
                textAlign={'center'} variant={'none'} textColor='gray.500'
                onClick={() => reset()}>
                Clear
              </Button>
              <Button size={'sm'} w={'7rem'} fontWeight={'600'}
                bg={'gray.100'} colorScheme='loginbtn' textColor='black'
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