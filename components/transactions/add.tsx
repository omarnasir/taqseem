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
    console.log(values)
    // Compute what each user owes
    // Case 1: Paid by everyone
    // Case 2: Paid by multiple users
    const amountDetails = values[FormIds.amountDetails] as TFormIds[FormIds.amountDetails];
    const everyone = values[FormIds.everyone] as boolean;
    if (everyone) {
      const userOwes = values[FormIds.amount] / groupDetail.users!.length
      const userDetails = groupDetail.users!.map(user => {
        return {
          id: user.id,
          owes: userOwes
        }
      })
      console.log('Case 1: ', { ...userDetails })
    }
    else {
      const selectedUsers = Object.keys(amountDetails).filter((userId) => amountDetails[userId] !== undefined)
      const usersWithoutInputAmount = Object.keys(amountDetails).filter((userId) => amountDetails[userId] === null)
      const remainingAmount = values[FormIds.amount] - Object.values(amountDetails).reduce(
        (acc : number, userAmount) => acc + (userAmount ? userAmount : 0), 0)
      if (usersWithoutInputAmount.length === 0 && remainingAmount > 0) {
        setError(FormIds.everyone, {
          type: 'manual',
          message: 'Exact user amounts must add up to total amount'
        })
        return
      }
      const owedAmountPerRemainingUser = remainingAmount / usersWithoutInputAmount.length;
      const userDetails = selectedUsers.map((userId) => {
        if (usersWithoutInputAmount.includes(userId)) {
          return {
            id: userId,
            owes: owedAmountPerRemainingUser
          }
        }
        else {
          return {
            id: userId,
            owes: amountDetails[userId]
          }
        }
      })
      console.log({ ...userDetails })
    }
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
            <FormItemCategory />
            <FormItemSubCategory />
            <FormItemDateTime />
            <FormItemPaidBy {...{ users: groupDetail.users! }} />
            <FormItemAmount />
            <FormItemAmountDetails {...{ users: groupDetail.users! }} />
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
                  amountDetails: undefined,
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
    </FormProvider>
  )
}