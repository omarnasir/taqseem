import { useRouter } from 'next/navigation'

import {
  Button,
  IconButton,
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
  Text,
  VStack
} from "@chakra-ui/react"
import { MdAdd } from "react-icons/md"

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
import { type GroupWithMembers } from "@/types/model/groups"
import { createTransaction } from "@/client/services/transaction-service"
import { CreateTransactionWithDetails } from "@/types/model/transactions";
import { useSession } from "next-auth/react";
import { CustomToast } from "@/components/toast";

export function Add(
  { group }: { group: GroupWithMembers }
) {
  const router = useRouter()
  const { data: sessionData } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { addToast } = CustomToast();

  const methods = useForm<TFormIds>({
    defaultValues: {
      name: '',
      category: 0,
      subcategory: 0,
      amount: '0',
      datetime: getCurrentDate(),
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
      createdAt: values[FormIds.datetime],
      transactionDetails: userDetails,
      notes: values[FormIds.note]
    })
    if (response.success) {
      reset();
      onClose();
      router.refresh();
    }
    else {
      addToast("Error creating transaction", response.error, "error")
    }
    return
  }

  return (
    <VStack w='100%'>
      <HStack w='100%' justifyContent={'space-between'}>
        <Text fontSize='xl' fontWeight='bold'>{group.name}</Text>
        <IconButton size={'md'} borderRadius={'full'}
        icon={<MdAdd/>} aria-label="Add transaction"
        onClick={onOpen}/>
      </HStack>
      <Divider marginY={2}/>
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
    </VStack>
  )
}