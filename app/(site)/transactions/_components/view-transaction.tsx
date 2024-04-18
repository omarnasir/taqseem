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
import { type GroupWithMembers } from "@/app/_types/model/groups"
import { createTransactionAction, updateTransactionAction, deleteTransactionAction } 
from "@/app/(site)/transactions/_lib/transactions-actions"
import {
  type CreateTransaction,
  type CreateTransactionDetails,
  type UpdateTransaction,
  type TransactionWithDetails
}
  from "@/app/_types/model/transactions";
import { TransactionFormIdEnum as FormIdEnum, FormTransaction, getTransactionFormDefaultValues, mapFormToTransaction, mapTransactionToForm, formatDateToString } from "@/app/(site)/transactions/_lib/transactions-helper";
import { CustomToast } from "@/app/_components/toast";
import Confirm from "@/app/_components/confirm";
import { UserBasicData } from "@/app/_types/model/users";

const steps = [
  { title: 'Fill in details' },
  { title: 'Decide how to split' },
]

function processUserDetailsByStrategy(values: FormTransaction, users: UserBasicData[]): CreateTransactionDetails[] | string | undefined {
  const strategy = values[FormIdEnum.strategy] as number;
  const totalAmount = parseFloat(values[FormIdEnum.amount]);
  const paidById = values[FormIdEnum.paidById];
  const transactionDetails = values[FormIdEnum.transactionDetails];
  // Strategy 0: Split equally
  if (strategy === 0) {
    const userAmount = totalAmount / users.length
    return users.map(user => {
      return {
        userId: user.id,
        amount: user.id === paidById ? userAmount : -userAmount
      }
    })
  }
  // Strategy > 0: Assign total amount to user at index [strategy - 1]
  else if (strategy > 0) {
    return users.map(user => {
      switch (user.id) {
        case users[strategy - 1].id:
          return {
            userId: user.id,
            amount: -totalAmount
          }
        case paidById:
          return {
            userId: user.id,
            amount: totalAmount
          }
        default:
          return {
            userId: user.id,
            amount: 0
          }
      }
    })
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
    userDetails.forEach(user => {
      if (user.userId !== values[FormIdEnum.paidById]) {
        user.amount = user.amount * -1
      }
    })
    return userDetails
  }
}


export default function TransactionView(
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
    console.log('Submitted: ', values)
    const userDetails: CreateTransactionDetails[] | string | undefined = processUserDetailsByStrategy(values, users);
    if (typeof userDetails === 'string') {
      setError(FormIdEnum.transactionDetails, { message: userDetails as string })
      return
    }
    // Build the transaction object
    const transaction = mapFormToTransaction(values, userDetails as CreateTransactionDetails[], group.id)
    if (values.id) {
      console.log('Updating transaction', transaction)
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
      console.log('Creating transaction', transaction)
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
    }
  }

  return (
    <Drawer
      size={'md'}
      placement="bottom"
      variant={'transaction'}
      isOpen={isOpen}
      onClose={() => { onCloseDrawer(), onClosePageTwo(), onOpenPageOne() }}
      {...disclosureProps}>
      <DrawerOverlay />
      <DrawerContent height='100vh' width={{ base: '100%', sm: 'xl'}} margin='auto'>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DrawerHeader
              color={'whiteAlpha.580'}
              textAlign={'center'}>
              {transactionWithDetails ? 'Edit Transaction' : 'Add Transaction'}
              <Stack letterSpacing={'wide'} fontWeight={400}>
                <Stepper index={activeStep} size={'sm'} colorScheme="green">
                  {steps.map((step, index) => (
                    <Step key={index}>
                      <StepIndicator>
                        <StepStatus
                          complete={<StepIcon />}
                          active={<MdCircle size={'0.2rem'}/>}
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
            <DrawerBody overflow={'auto'} height='90vh' paddingBottom={'30vh'}>
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
                    <Button size={'sm'} w={'30%'}
                      leftIcon={<MdDelete size={'1rem'} />}
                      textAlign={'center'} variant={'delete'}
                      onClick={onOpenRemoveTransaction}>Delete</Button>
                    <Confirm isOpen={isOpenRemoveTransaction} onClose={onCloseRemoveTransaction} callback={() => {
                      onRemoveTransaction(transactionWithDetails.id); onCloseRemoveTransaction();
                    }} mode="removeTransaction" />
                  </> : <Box w={'30%'} />
                }
                <HStack w={'40%'} justifyContent={'center'}>
                  <IconButton
                    variant={'formNavigation'}
                    aria-label="Back"
                    icon={<IconPrev />}
                    isDisabled={isOpenPageOne}
                    onClick={() => { setActiveStep(0), onClosePageTwo(), onOpenPageOne() }} />
                  <IconButton
                    variant={'formNavigation'}
                    aria-label="Next"
                    icon={<IconNext />}
                    isDisabled={isOpenPageTwo}
                    onClick={() => { setActiveStep(1), onClosePageOne(), onOpenPageTwo() }} />
                </HStack>
                <Button size={'sm'} w={'30%'}
                  leftIcon={transactionWithDetails ? <MdOutlineSync size={'1.2rem'} /> : <MdAdd size={'1.2rem'}/>}
                  variant={transactionWithDetails ? 'update' : 'add'}
                  isDisabled={!isValid || !isDirty || isOpenPageOne}
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