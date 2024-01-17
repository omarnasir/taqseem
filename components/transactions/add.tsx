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
} from "@chakra-ui/react"
import { FieldValues, FormProvider, useForm } from "react-hook-form";

import { GroupWithMembers } from "@/types/model/groups"
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
  getCurrentDate
} from "@/components/transactions/form-items";

export function Add(
  { isOpen, onClose, groupDetail }:
  { isOpen: boolean, onClose: () => void, groupDetail: GroupWithMembers }
) {

  const methods = useForm()
  const {
    handleSubmit,
    reset,
    setError,
  } = methods

  function onSubmit(values: FieldValues) {
    console.log('Original: ', values)
    // Compute what each user owes
    // Case 1: Paid by everyone
    // Case 2: Paid by multiple users
    // if (values[FormIds.everyone]) {
    //   const userOwes = values[FormIds.amount] / groupDetail.users!.length
    //   const userDetails = groupDetail.users!.map(user => {
    //     return {
    //       id: user.id,
    //       owes: userOwes
    //     }
    //   })
    //   console.log('Case 1: ', userDetails)
    // }
    // else {
    //   let usersWithoutOwedAmount = 0;
    //   let remainingAmount = values[FormIds.amount];
    //   Object.entries(values[FormIds.amountDetails] as TFormIds[FormIds.amountDetails]).map(
    //     ([userId, details]) => {
    //       {
    //         if (details.checked) {
    //           if (details.amount === 0 || isNaN(details.amount)) {
    //             usersWithoutOwedAmount += 1
    //           }
    //           else if (details.amount !== 0) {
    //             remainingAmount -= details.amount
    //           }
    //         }
    //       }
    //     }) 
    //   if (usersWithoutOwedAmount > groupDetail.users!.length) {
    //     setError(FormIds.amountDetails, {
    //       type: 'custom',
    //       message: 'Amount details are incorrect'
    //     })
    //     return
    //   }
    //   if (remainingAmount < 0) {
    //     setError(FormIds.amountDetails, {
    //       type: 'custom',
    //       message: 'Amount details are incorrect'
    //     })
    //     return
    //   }
    //   let totalOwedAmount = 0;
    //   const owedAmountPerRemainingUser = remainingAmount / usersWithoutOwedAmount;
    //   const userDetails = Object.entries(values[FormIds.amountDetails] as TFormIds[FormIds.amountDetails]).map(
    //     ([userId, details]) => {
    //       {
    //         if (details.checked){
    //           if (details.amount === 0 || isNaN(details.amount)) {
    //             totalOwedAmount += owedAmountPerRemainingUser
    //             return {
    //               id: userId,
    //               owes: owedAmountPerRemainingUser
    //             }
    //           }
    //           else {
    //             totalOwedAmount += details.amount
    //             return {
    //               id: userId,
    //               owes: details.amount
    //             }
    //           }
    //         }
    //       }
    //     })
    //     if (totalOwedAmount !== values[FormIds.amount]) {
    //       setError(FormIds.everyone, {
    //         type: 'manual',
    //         message: 'Exact user amounts must add up to total amount'
    //       })
    //       return
    //     }
    //   console.log('Case 2: ', {...userDetails})
    // }

    // const response = await handlerRegisterAuth({
    //   name: values.name,
    //   email: values.email,
    //   password: values.password,
    // })
    // if (!response.success) {
    //   addToast('Error in Registering', response.error, 'error');
    // }
    // else {
    //   addToast('Signup successful!', null, 'success')
    // }
  };

  return (
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
          <FormProvider {...methods}>
            <FormItemName />
            <FormItemCategory />
            <FormItemSubCategory />
            <FormItemDateTime />
            <FormItemPaidBy {...{ users: groupDetail.users! }} />
            <FormItemAmount/>
            <FormItemAmountDetails {...{ users: groupDetail.users! }} />
          </FormProvider>
        </ModalBody>
        <ModalFooter mt={-4}>
          <Flex direction={'row'} justifyContent={'space-between'} w='100%'>
          <Button size={'sm'} fontWeight={'400'}
            textAlign={'center'} variant={'none'} textColor='gray.500' 
            onClick={() => reset({
              name: null,
              category: null,
              amount: null,
              datetime: getCurrentDate(),
              amountDetails: null,
            })}>
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
  )
}