import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react"
import { FieldValues, useForm } from "react-hook-form";

import FormItem, { FormItemAmount, FormItemCategory, FormItemDateTime, FormItemName } from "@/components/transactions/form-item";

export function AddItem(
  { isOpen, onClose, }: { isOpen: boolean, onClose: () => void }
) {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm()

  async function onSubmit(values: FieldValues) {
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
        <ModalCloseButton />
        <ModalBody>
          <FormItemName {...{ errors, register }} />
          <FormItemCategory {...{ errors, register }} />
          <FormItemAmount {...{ errors, register }} />
          <FormItemDateTime {...{ errors, register }} />
        </ModalBody>
        <ModalFooter>
          <Button
            mt={1}
            size={'sm'}
            w={'5rem'}
            bg={'gray.100'}
            colorScheme='loginbtn'
            textColor='blue.900'
            isLoading={isSubmitting}
            type='submit'>
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}