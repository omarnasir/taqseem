import { useMemo } from "react";
import {
  Button,
  DrawerHeader,
  DrawerOverlay,
  DrawerBody,
  Drawer,
  DrawerFooter,
  DrawerCloseButton,
  DrawerContent,
  IconButton,
  HStack,
  Box,
  Text,
  SimpleGrid,
  VStack,
  Divider,
} from "@chakra-ui/react"

import {
  MdDelete,
  MdOutlineSync,
  MdAdd
} from "react-icons/md"

import { FormProvider, useForm } from "react-hook-form";

import { useSessionHook } from '@/client/hooks/session.hook';
import { useMutationAction } from "@/client/hooks/transactions.hook";

import {
  FormItemId,
  FormItemAmount,
  FormItemTransactionDetails,
  FormItemCategory,
  FormItemSubCategory,
  FormItemDateTime,
  FormItemName,
  FormItemPaidBy,
  FormItemNote,
  FormItemIsSettlement
} from "./form-items";

import { type GroupWithMembers } from "@/types/groups.type";
import { createTransactionAction, updateTransactionAction, deleteTransactionAction } from "@/server/actions/transactions.action";
import {
  type CreateTransaction,
  type CreateTransactionDetails,
  type UpdateTransaction,
  type TransactionWithDetails
}
from "@/types/transactions.type";
import { CustomToast } from "@/components/toast";
import { Confirm } from "@/app/(site)/components/confirm";
import { formatDateToString, 
  FormIdEnum, 
  type FormTransaction, 
  getTransactionFormDefaultValues, 
  mapFormToTransaction, 
  mapTransactionToForm 
} from "./utils";


function processTransactionDetails(values: FormTransaction): CreateTransactionDetails[] {
  const totalAmount = parseFloat(values[FormIdEnum.amount] as string);
  const transactionDetails = values[FormIdEnum.transactionDetails];
  const selectedUsers = transactionDetails.filter((transactionDetails) => transactionDetails.amount !== undefined)
  const usersWithoutInputAmount = selectedUsers.filter((selectedUser) => (selectedUser.amount === ''))
  const sum = transactionDetails.reduce((acc: number, item) => acc + (parseFloat(item.amount as string) || 0), 0)
  if (selectedUsers.length === 0) {
    throw 'You must select at least one user'
  }
  else if (sum > totalAmount) {
    throw 'The sum of the amounts is greater than the total amount'
  }
  else if (sum === totalAmount && usersWithoutInputAmount.length > 0) {
    throw 'Some users are not participating in the transaction'
  }
  else if (sum < totalAmount && usersWithoutInputAmount.length === 0) {
    throw 'Exact user amounts must add up to total amount'
  }
  const remainingAmount = totalAmount - sum;
  const owedAmountPerRemainingUser = remainingAmount / usersWithoutInputAmount.length;
  const userDetails: CreateTransactionDetails[] = selectedUsers.map((selectedUser) => {
    return {
      userId: selectedUser.userId,
      amount: (selectedUser.amount === '') ? owedAmountPerRemainingUser : parseFloat(selectedUser.amount as string)
    }
  })
  return userDetails
}


function Transaction(
  { group, disclosureProps, isOpen, onCloseDrawer, transactionWithDetails }: {
    group: GroupWithMembers,
    disclosureProps: any,
    isOpen: boolean,
    onCloseDrawer: () => void,
    transactionWithDetails?: TransactionWithDetails
  }
) {
  const { session } = useSessionHook();
  const users = group.users!;

  const mutation = useMutationAction();

  const defaultValues: FormTransaction = useMemo(() => (
    transactionWithDetails ? mapTransactionToForm(transactionWithDetails, users) : getTransactionFormDefaultValues(group.id, session?.user?.id as string, users)
  ), [session, group, users, transactionWithDetails]);

  const methods = useForm<FormTransaction>({
    values: defaultValues
  });

  const {
    handleSubmit,
    setError,
    clearErrors,
    formState: { isDirty, isValid }
  } = methods
  const { addToast } = CustomToast();


  async function onSubmit(values: FormTransaction) {
    clearErrors(FormIdEnum.transactionDetails)
    let userDetails: CreateTransactionDetails[] = [];
    try {
      userDetails = processTransactionDetails(values);
    }
    catch (error) {
      setError(FormIdEnum.transactionDetails, { message: error })
      return
    }
    // Build the transaction object
    const transaction = mapFormToTransaction(values, userDetails as CreateTransactionDetails[], group.id)
    const response = await(values.id ? updateTransactionAction(group.id, transaction as UpdateTransaction) : 
      createTransactionAction(group.id, transaction as CreateTransaction));
    if (response.success) {
      mutation.mutate({
        action: values.id ? 'update' : 'create',
        data: response.data,
        transactionId: response.data?.id as number,
        groupId: group.id
      });
      onCloseDrawer();
    }
    else {
      addToast(values.id ? "Error updating transaction" : "Error creating transaction", response.error, "error")
    }
    return
  }

  async function onRemoveTransaction(id: number) {
    const res = await deleteTransactionAction(session?.user?.id!, group?.id!, id)
    if (res.success) {
      mutation.mutate({
        action: 'remove',
        transactionId: id,
        groupId: group.id
      });
      addToast(`Transaction removed`, null, 'success')
    }
    else {
      addToast('Cannot delete transaction.', res.error, 'error')
    }
    onCloseDrawer();
  }

  return (
    <Drawer
      size={'md'}
      placement="bottom"
      variant={'transaction'}
      isOpen={isOpen}
      onClose={() => { onCloseDrawer() }}
      {...disclosureProps}>
      <DrawerOverlay />
      <DrawerContent height='100%' width={{ base: '100%', sm: 'xl' }} margin='auto'>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DrawerHeader w='100%'
              zIndex={1700} height={'8vh'} position='absolute' top={0}
              fontWeight={300} fontSize={'md'} color={'white'} textAlign={'start'} letterSpacing={'widest'}>
              {transactionWithDetails ? 'Edit Transaction' : 'Add Transaction'}
              <DrawerCloseButton />
            </DrawerHeader>
            <DrawerBody  position='absolute' w='100%' paddingX={2} 
              overflow={'scroll'} pt={'10vh'} paddingBottom={20}
              sx={{
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
                scrollbarWidth: 'none',
              }}
              top={0}
              bottom={'10vh'}>
              <FormItemId />
              <VStack padding={2} w='100%'>
                <HStack justifyContent={'space-around'} w='100%'>
                  <Text width={'80%'} fontSize={'xs'} fontWeight={300} alignSelf={'flex-start'} letterSpacing={'wide'} color={'whiteAlpha.700'}>Step 1: Fill in details</Text>
                  <FormItemIsSettlement />
                </HStack>
                <Divider marginBottom={2} />
                <SimpleGrid columns={2} spacing={2} width={'100%'}>
                  <FormItemName />
                  <FormItemDateTime />
                  <FormItemCategory />
                  <FormItemSubCategory />
                </SimpleGrid>
                <SimpleGrid columns={2} spacing={2} width={'100%'}>
                  <FormItemPaidBy {...{ users: users }} />
                  <FormItemAmount />
                </SimpleGrid>
                <FormItemNote />
              </VStack>
              <VStack padding={2} marginY={4} width={'100%'}>
                <Text fontSize={'xs'} fontWeight={300} alignSelf={'flex-start'} letterSpacing={'wide'} color={'whiteAlpha.700'}>Step 2: Decide how to split</Text>
                <Divider marginBottom={2} />
                <FormItemTransactionDetails {...{ users: users, transactionDetails: transactionWithDetails?.transactionDetails }} />
              </VStack>
            </DrawerBody>
            <DrawerFooter position={'absolute'}
              zIndex={1700}
              w={'100%'}
              borderTopWidth={1}
              borderTopColor={'whiteAlpha.200'}
              h='10vh'
              overflow={'hidden'}
              bottom={0}>
              <HStack justifyContent={'space-between'} w='100%'>
                {transactionWithDetails ?
                  <>
                    <Confirm callback={() => {
                      onRemoveTransaction(transactionWithDetails.id)
                    }} mode="removeTransaction">
                      <IconButton w={'13%'}
                        aria-label="Delete"
                        icon={<MdDelete size={'1.5rem'} />}
                        textAlign={'center'} variant={'deleteBin'} />
                    </Confirm>
                  </> : <Box w={'13%'} />
                }
                <Button size={'sm'} w={'29%'}
                  leftIcon={transactionWithDetails ? <MdOutlineSync size={'1rem'} /> : <MdAdd size={'1rem'}/>}
                  variant={transactionWithDetails ? 'update' : 'add'}
                  isDisabled={!isValid || !isDirty} 
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

export {
  Transaction,
  formatDateToString
}