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
  Heading,
  Divider,
  Tabs, TabList, TabPanels, Tab, TabPanel,
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
  type TransactionWithDetails,
  type FormTransaction
}
from "@/types/transactions.type";
import { CustomToast } from "@/components/toast";
import { Confirm } from "@/app/(site)/components/confirm";
import { formatDateToString, 
  FormIdEnum, 
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
  { group, disclosureProps, isOpen, onCloseDrawer, transactionWithDetails, shouldRefetch }: {
    group: GroupWithMembers,
    disclosureProps: any,
    isOpen: boolean,
    onCloseDrawer: () => void,
    transactionWithDetails?: TransactionWithDetails,
    shouldRefetch?: boolean
  }
) {
  const { session } = useSessionHook();
  const users = group.users!;

  const mutation = useMutationAction();

  const defaultValues: FormTransaction = useMemo(() => {
    return transactionWithDetails ? mapTransactionToForm(transactionWithDetails, users) : getTransactionFormDefaultValues(group.id, session?.user?.id as string, users)
  }, [group.id, session?.user?.id, users, transactionWithDetails]);

  const methods = useForm<FormTransaction>({
    values: defaultValues
  });
  const { clearErrors, setError }  = methods;

  const { addToast } = CustomToast();

  async function onSubmit(values: FormTransaction) {
    clearErrors(FormIdEnum.transactionDetails);
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
    const response = await (values.id === -1 ? createTransactionAction(group.id, transaction as CreateTransaction) :
      updateTransactionAction(group.id, transaction as UpdateTransaction));
    if (response.success) {
      mutation.mutate({
        action: values.id === -1 ? 'create' : 'update',
        data: response.data,
        transactionId: response.data?.id as number,
        groupId: group.id
      });
      onCloseDrawer();
      if (shouldRefetch) {
        window.location.reload();
      }
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
    if (shouldRefetch) {
      window.location.reload();
    }
  }

  return (
    <Drawer
      size={{ base: 'full', md: 'md' }}
      placement={{ base: 'bottom', lg: 'right' }}
      allowPinchZoom={true}
      variant={'transaction'}
      isOpen={isOpen}
      onClose={() => { onCloseDrawer() }}
      {...disclosureProps}>
      <DrawerOverlay />
      <DrawerContent height='100%' margin='auto'>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <DrawerHeader w='100%' height={'8vh'} position='absolute'>
                <Heading size={'h2'}>{transactionWithDetails ? 'Edit Transaction' : 'Add Transaction'}</Heading>
              <DrawerCloseButton />
            </DrawerHeader>
            <DrawerBody position='absolute' overflowX={'clip'} p={{ base: 1, sm: 2 }} width='100%'
              overflowY={'scroll'} paddingBottom={20}
              sx={{
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
                scrollbarWidth: 'none',
              }}
              top={'10vh'}
              bottom={'10vh'}>
              <Tabs isFitted variant='transaction' colorScheme="purple">
                <TabList>
                  <Tab marginRight={1}>Details</Tab>
                  <Tab marginLeft={1}>Split</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <SimpleGrid columns={1} spacing={2} width={'100%'}>
                      <HStack justifyContent={'space-between'} alignItems={'center'} w='100%' h={'2rem'}>
                        <Text variant={'caption'}>Step 1: Fill in details</Text>
                        <FormItemIsSettlement />
                      </HStack>
                      <Divider marginBottom={2} />
                      <FormItemName />
                      <FormItemDateTime />
                      <FormItemCategory />
                      <FormItemSubCategory />
                      <FormItemNote />
                      <FormItemId />
                    </SimpleGrid>
                  </TabPanel>
                  <TabPanel>
                    <SimpleGrid columns={1} spacing={2} width={'100%'}>
                    <HStack justifyContent={'space-between'} w='100%'  h={'2rem'}>
                      <Text variant={'caption'}>Step 2: Decide how to split</Text>
                    </HStack>
                    <Divider marginBottom={2} />
                    <FormItemPaidBy {...{ users: users }} />
                    <FormItemAmount />
                    <FormItemTransactionDetails {...{ users: users, transactionDetails: transactionWithDetails?.transactionDetails }} />
                    </SimpleGrid>
                  </TabPanel>
                </TabPanels>
              </Tabs>
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
                  isDisabled={!methods.formState.isValid || !methods.formState.isDirty} 
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