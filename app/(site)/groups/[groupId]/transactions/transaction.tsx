import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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
  Step,
  StepIcon,
  StepIndicator,
  StepSeparator,
  StepStatus,
  Stepper,
  useSteps,
} from "@chakra-ui/react"

import {
  MdChevronLeft as IconPrev,
  MdChevronRight as IconNext,
  MdDelete,
  MdOutlineSync,
  MdCircle,
  MdAdd
} from "react-icons/md"

import { FormProvider, useForm } from "react-hook-form";

import {
  FormItemId,
  FormItemAmount,
  FormItemTransactionStrategy,
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
  strategy = 'strategy',
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

const steps = [
  { title: 'Fill in details' },
  { title: 'Decide how to split' },
]

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
function getTransactionFormDefaultValues(groupId: string, userId: string): FormTransaction {
  return {
    id: undefined,
    name: '',
    amount: '',
    strategy: 0,
    transactionDetails: [],
    category: 0,
    subCategory: 0,
    paidAt: formatDateToString(new Date()),
    paidById: userId,
    notes: '',
    groupId: groupId,
    createdById: userId,
  }
}


function processUserDetailsByStrategy(values: FormTransaction, users: UserBasicData[]): CreateTransactionDetails[] | string | undefined {
  const strategy = values[FormIdEnum.strategy] as number;
  const totalAmount = parseFloat(values[FormIdEnum.amount]);
  const transactionDetails = values[FormIdEnum.transactionDetails];
  // Strategy 0: Split equally
  if (strategy === 0) {
    const userAmount = totalAmount / users.length
    return users.map(user => ({ userId: user.id, amount: userAmount}));
  }
  // Strategy > 0: Assign total amount to user at index [strategy - 1]
  else if (strategy > 0) {
    return users.map(user => ({
      userId: user.id,
      amount: (user.id === users[strategy - 1].id) ? totalAmount : 0
    }))
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
    const userDetails: CreateTransactionDetails[] = selectedUsers.map((selectedUser) => {
      return {
        userId: selectedUser.userId,
        amount: (selectedUser.amount === '') ? owedAmountPerRemainingUser : parseFloat(selectedUser.amount)
      }
    })
    return userDetails
  }
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

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  })

  const defaultValues: FormTransaction = useMemo(() => (
    transactionWithDetails ? mapTransactionToForm(transactionWithDetails) : getTransactionFormDefaultValues(group.id, sessionData?.user?.id!)
  ), [sessionData, group, transactionWithDetails]);

  const methods = useForm<FormTransaction>({
    values: defaultValues
  });
  const {
    handleSubmit,
    setError,
    formState: { isDirty, isValid }
  } = methods

  async function onSubmit(values: FormTransaction) {

    const userDetails: CreateTransactionDetails[] | string | undefined = processUserDetailsByStrategy(values, users);
    if (typeof userDetails === 'string') {
      setError(FormIdEnum.transactionDetails, { message: userDetails as string })
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
              zIndex={1} height={'15vh'} position='absolute' top={0}
              fontWeight={300} fontSize={'md'} color={'white'} textAlign={'center'} letterSpacing={'widest'}>
              {transactionWithDetails ? 'Edit Transaction' : 'Add Transaction'}
              <Stack letterSpacing={'wide'} fontWeight={400} mt={2}>
                <Stepper index={activeStep} size={'sm'} colorScheme="green">
                  {steps.map((step, index) => (
                    <Step key={index}>
                      <StepIndicator>
                        <StepStatus
                          complete={<StepIcon />}
                          active={<MdCircle size={'0.2rem'} />}
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
            <DrawerBody  position='absolute' w='100%' paddingX={8} 
              overflow={'scroll'} pt={'15vh'}
              sx={{
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
                scrollbarWidth: 'none',
              }}
              top={0}
              bottom={'10vh'}>
              <ScaleFade in={activeStep === 0}>
                <Flex direction={'column'} display={activeStep === 0 ? 'flex' : 'none'}>
                  <FormItemId />
                  <FormItemName />
                  <FormItemDateTime />
                  <FormItemCategory />
                  <FormItemSubCategory />
                  <FormItemPaidBy {...{ users: users }} />
                  <FormItemNote />
                </Flex>
              </ScaleFade>
              <ScaleFade in={activeStep === 1}>
                <Flex direction={'column'} display={activeStep === 1 ? 'flex' : 'none'}>
                  <FormItemAmount />
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
                  leftIcon={<IconPrev size={'1rem'} />}
                  variant={'formNavigation'}
                  aria-label="Back"
                  isDisabled={activeStep !== 1}
                  onClick={() => { setActiveStep(0) }}>Back</Button>
                <Button size={'sm'} w={'29%'}
                  leftIcon={<IconNext size={'1rem'} />}
                  variant={'formNavigation'}
                  aria-label="Next"
                  isDisabled={activeStep === 1}
                  onClick={() => { setActiveStep(1) }}>Next</Button>
                <Button size={'sm'} w={'29%'}
                  leftIcon={transactionWithDetails ? <MdOutlineSync size={'1rem'} /> : <MdAdd size={'1rem'}/>}
                  variant={transactionWithDetails ? 'update' : 'add'}
                  isDisabled={!isValid || !isDirty || activeStep !== 1} 
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