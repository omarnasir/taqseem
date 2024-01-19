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
import { FormProvider, useForm } from "react-hook-form";

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
  processAmountDetails,
  getCurrentDate
} from "@/components/transactions/form-items";

export function Add(
  { isOpen, onClose, groupDetail }:
  { isOpen: boolean, onClose: () => void, groupDetail: GroupWithMembers }
) {

  const methods = useForm<TFormIds>()
  const {
    handleSubmit,
    reset,
  } = methods

  function onSubmit(values: TFormIds) {
    const everyone = values[FormIds.everyone] as boolean;
    if (everyone) {
      const userDetails = groupDetail.users!.map(user => {
        return {
          id: user.id,
          amount: values[FormIds.amount] / groupDetail.users!.length
        }
      })
      console.log('Case 1: ', { ...userDetails })
    }
    else {
      const amountDetails = values[FormIds.amountDetails] as TFormIds[FormIds.amountDetails];
      const { selectedUsers, usersWithoutInputAmount, sum } = processAmountDetails(amountDetails)
      const remainingAmount = values[FormIds.amount] - sum;
      const owedAmountPerRemainingUser = remainingAmount / usersWithoutInputAmount.length;
      const userDetails = selectedUsers.map((selectedUser) => {
        return {
          id: selectedUser.id,
          amount: isNaN(selectedUser.amount) ? owedAmountPerRemainingUser : selectedUser.amount
        }
      })
      console.log({ ...userDetails })
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
                  name: '',
                  category: '',
                  amount: 0,
                  datetime: getCurrentDate(),
                  amountDetails: undefined,
                  everyone: false,
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