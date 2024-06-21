import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import {
  Button,
  useDisclosure,
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

import {
  FormItemId,
  FormItemAmount,
  FormItemTransactionDetails,
  FormItemCategory,
  FormItemSubCategory,
  FormItemDateTime,
  FormItemName,
  FormItemPaidBy,
  FormItemNote
} from "./form-items";

import { type GroupWithMembers } from "@/app/_types/model/groups";
import { createTransactionAction, updateTransactionAction, deleteTransactionAction } from "@/app/_actions/transactions";
import {
  type CreateTransaction,
  type CreateTransactionDetails,
  type UpdateTransaction,
  type TransactionWithDetails
}
  from "@/app/_types/model/transactions";
import { CustomToast } from "@/app/_components/toast";
import Confirm from "@/app/(site)/_components/confirm";
import { UserBasicData } from "@/app/_types/model/users";

// Declare enum for form field ids to avoid hardcoding strings.
enum FormIdEnum {
  id = 'id',
  name = 'name',
  amount = 'amount',
  transactionDetails = 'transactionDetails',
  category = 'category',
  subCategory = 'subCategory',
  paidAt = 'paidAt',
  paidById = 'paidById',
  notes = 'notes'
}

// Reuse auto-generated types from Prisma.
// Override amount fields to be string instead of number to match form input type.
type FormTransactionDetails = Omit<CreateTransactionDetails, "amount"> & {
  amount: string
}

interface FormTransaction extends Omit<CreateTransaction, "transactionDetails" | "amount"> {
  amount: string,
  transactionDetails: FormTransactionDetails[]
}

/**
 * Format date to string.
 * @param date - Date object.
 * @returns Formatted date string.
 */
function formatDateToString(date: Date) {
  const formattedDate = new Date(date).toLocaleDateString('en-ca', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  })
  return formattedDate
}

/**
 * Map form data to transaction object.
 * @param form - Form data.
 * @param userDetails - Transaction details.
 * @param groupId - Group id.
 * @returns Transaction object.
  */
function mapFormToTransaction(form: FormTransaction, userDetails: CreateTransactionDetails[], groupId: string): CreateTransaction | UpdateTransaction {
  return {
    ...form,
    amount: parseFloat(form.amount),
    groupId: groupId,
    paidAt: new Date(form.paidAt as string).toISOString(),
    transactionDetails: userDetails
  }
}

/**
 * Map transaction object to form data.
 * @param transaction - Transaction object.
 * @returns Form data.
 */
function mapTransactionToForm(transaction: TransactionWithDetails): FormTransaction {
  return {
    ...transaction,
    amount: transaction.amount.toFixed(2),
    paidAt: formatDateToString(transaction.paidAt),
    transactionDetails: transaction.transactionDetails.map((detail) => {
      return {
        userId: detail.userId,
        amount: detail.amount.toString()
      }
    })
  }
}

/**
 * Declare Transaction Form default values.
 * @param groupId - Group id of the active group.
 * @param userId - User id of the current user.
 * @returns Form data.
 */
function getTransactionFormDefaultValues(groupId: string, userId: string, users: UserBasicData[]): FormTransaction {
  return {
    id: undefined,
    name: '',
    amount: '',
    transactionDetails: users.map(user => ({ userId: user.id, amount: '' })),
    category: 0,
    subCategory: 0,
    paidAt: formatDateToString(new Date()),
    paidById: userId,
    notes: '',
    groupId: groupId,
    createdById: userId,
  }
}


function processTransactionDetails(values: FormTransaction): CreateTransactionDetails[] {
  const totalAmount = parseFloat(values[FormIdEnum.amount]);
  const transactionDetails = values[FormIdEnum.transactionDetails];
  const selectedUsers = transactionDetails.filter((transactionDetails) => transactionDetails.amount !== undefined)
  const usersWithoutInputAmount = selectedUsers.filter((selectedUser) => (selectedUser.amount === ''))
  const sum = transactionDetails.reduce((acc: number, item) => acc + (parseFloat(item.amount) || 0), 0)
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
      amount: (selectedUser.amount === '') ? owedAmountPerRemainingUser : parseFloat(selectedUser.amount)
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
    transactionWithDetails?: TransactionWithDetails,
  }
) {
  const users = group.users!;
  const router = useRouter();
  const { data: sessionData } = useSession();
  const { addToast } = CustomToast();
  const { isOpen: isOpenRemoveTransaction, onOpen: onOpenRemoveTransaction, onClose: onCloseRemoveTransaction } = useDisclosure()

  const defaultValues: FormTransaction = useMemo(() => (
    transactionWithDetails ? mapTransactionToForm(transactionWithDetails) : getTransactionFormDefaultValues(group.id, sessionData?.user?.id!, users)
  ), [sessionData, group, users, transactionWithDetails]);

  const methods = useForm<FormTransaction>({
    values: defaultValues
  });
  const {
    handleSubmit,
    setError,
    clearErrors,
    formState: { isDirty, isValid }
  } = methods

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
    if (values.id) {

      const response = await updateTransactionAction(group.id, transaction as UpdateTransaction);
      if (response.success) {
        onCloseDrawer();
        router.refresh();
      }
      else {
        addToast("Error updating transaction", response.error, "error")
      }
    }
    else {

      const response = await createTransactionAction(group.id, transaction as CreateTransaction);
      if (response.success) {
        onCloseDrawer();
        router.refresh();
      }
      else {
        addToast("Error creating transaction", response.error, "error")
      }
    }
    return
  }

  async function onRemoveTransaction(id: number) {
    const res = await deleteTransactionAction(sessionData?.user?.id!, group?.id!, id)
    if (res.success) {
      addToast(`Transaction removed`, null, 'success')
      onCloseDrawer();
      router.refresh();
    }
    else {
      addToast('Cannot delete transaction.', res.error, 'error')
      onCloseDrawer();
      router.refresh();
    }
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
              fontWeight={300} fontSize={'md'} color={'white'} textAlign={'center'} letterSpacing={'widest'}>
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
              <VStack padding={2}>
                <Text fontSize={'xs'} fontWeight={300} alignSelf={'flex-start'} letterSpacing={'wide'} color={'whiteAlpha.700'}>Step 1: Fill in details</Text>
                <Divider marginBottom={2} />
                <SimpleGrid columns={2} spacing={2}>
                  <FormItemName />
                  <FormItemDateTime />
                  <FormItemCategory />
                  <FormItemSubCategory />
                </SimpleGrid>
                <FormItemNote />
                <SimpleGrid columns={2} spacing={2}>
                  <FormItemPaidBy {...{ users: users }} />
                  <FormItemAmount />
                </SimpleGrid>
              </VStack>
              <VStack padding={2} marginY={4}>
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
                    <IconButton w={'13%'}
                      aria-label="Delete"
                      icon={<MdDelete size={'1.5rem'} />}
                      textAlign={'center'} variant={'deleteBin'}
                      onClick={onOpenRemoveTransaction} />
                    <Confirm isOpen={isOpenRemoveTransaction} onClose={onCloseRemoveTransaction} callback={() => {
                      onRemoveTransaction(transactionWithDetails.id); onCloseRemoveTransaction();
                    }} mode="removeTransaction" />
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
  FormIdEnum,
  formatDateToString
}