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
import { FieldValues, useForm } from "react-hook-form";

import { GroupWithMembers } from "@/types/model/groups"
import { 
  FormItemAmount, 
  FormItemCategory, 
  FormItemDateTime,
  FormItemName,
  FormItemPaidBy,
  getCurrentDate
} from "@/components/transactions/form-items";

export function Add(
  { isOpen, onClose, groupDetail }:
  { isOpen: boolean, onClose: () => void, groupDetail: GroupWithMembers }
) {

  const {
    handleSubmit,
    register,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm()

  async function onSubmit(values: FieldValues) {
    console.log(values)
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
      size={{ xl: '2xl', base: 'xl' }}
    >
      <ModalOverlay />
      <ModalContent marginX={2} 
        as='form' onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader
          textAlign={'left'}
          fontSize={'lg'}
          fontWeight={'light'}>New transaction</ModalHeader>
        <Divider />
        <ModalCloseButton />
        <ModalBody>
          <FormItemName {...{ errors, register }} />
          <FormItemCategory {...{ errors, register }} />
          <FormItemDateTime {...{ errors, register }} />
          <FormItemPaidBy {...{errors, register, users: groupDetail.users!}} />
          <FormItemAmount {...{ errors, register, getValues, users: groupDetail.users! }} />
        </ModalBody>
        <ModalFooter mt={-4}>
          <Flex direction={'row'} justifyContent={'space-between'} w='100%'>
          <Button size={'md'} fontWeight={'light'}
            textAlign={'center'} variant={'none'} textColor='gray.500' 
            onClick={() => reset({
              name: null,
              category: null,
              amount: null,
              datetime: getCurrentDate(),
              amountDetails: null
            })}>
            Clear
          </Button>
          <Button size={'md'} w={'7rem'} fontWeight={'500'}
            bg={'gray.100'} colorScheme='loginbtn' textColor='black'
            isLoading={isSubmitting} type='submit'>
            Add
          </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}