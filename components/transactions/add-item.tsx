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
  FormItemAmount, FormItemCategory, FormItemDateTime, FormItemName,
  FormItemPaidBy
} from "@/components/transactions/form-items";

export function AddItem(
  { isOpen, onClose, groupDetail }:
  { isOpen: boolean, onClose: () => void, groupDetail: GroupWithMembers }
) {

  const {
    handleSubmit,
    register,
    reset,
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
      <ModalContent marginX={2} mt={'5rem'}
        as='form' onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader
          textAlign={'left'}
          fontSize={'lg'}
          fontWeight={'light'}>New transaction</ModalHeader>
        <Divider mb={4} />
        <ModalCloseButton />
        <ModalBody>
          <FormItemName {...{ errors, register }} />
          <FormItemCategory {...{ errors, register }} />
          <FormItemAmount {...{ errors, register }} />
          <FormItemDateTime {...{ errors, register }} />
          <FormItemPaidBy {...{errors, register, users: groupDetail.users!}} />
        </ModalBody>
        <ModalFooter mt={-3}>
          <Flex direction={'row'} justifyContent={'space-between'} w='100%'>
          <Button mt={1} size={'md'} fontWeight={'light'}
            textAlign={'center'} variant={'none'} textColor='gray.500' 
            onClick={() => reset({
              name: null,
              category: null,
              amount: null,
              datetime: null,
            })}>
            Clear
          </Button>
          <Button mt={1} size={'md'} w={'7rem'}
            bg={'gray.100'} colorScheme='loginbtn' textColor='blue.900'
            isLoading={isSubmitting} type='submit'>
            Add
          </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}