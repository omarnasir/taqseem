'use client'
import {
  Button,
  Heading,
  Flex,
  Link,
  Divider,
  FormControl,
} from '@chakra-ui/react'
import { useForm, FieldValues, FormProvider } from "react-hook-form"

import { NameFormItem, EmailFormItem, PasswordFormItem } from '@/app/(auth)/_components/form-items';
import { registerAction } from '@/app/_actions/auth';
import { CustomToast } from '@/app/_components/toast';


export default function Register() {
  const { addToast } = CustomToast();

  const methods = useForm()
  const { handleSubmit, formState } = methods

  async function onSubmit(values: FieldValues) {
    const response = await registerAction({
      name: values.name,
      email: values.email,
      password: values.password,
    })
    if (response) {
      addToast('Error in Registering', response, 'error');
    }
    else {
      addToast('Signup successful!', null, 'success')
    }
  };

  return (
    <FormControl as='form' onSubmit={handleSubmit(onSubmit)}>
      <Heading textAlign={'left'} fontSize={'xl'} mb={4} fontWeight={'light'}>Signup</Heading>
      <Divider mb={4} />
      <FormProvider {...methods}>
        <NameFormItem />
        <EmailFormItem />
        <PasswordFormItem />
        <Button mt={4} w='100%' isLoading={formState.isSubmitting} type='submit' variant={'login'}>
          Register
        </Button>
      </FormProvider>
      <Flex direction={'row'} justifyContent={'center'} mt={6}>
        <Link href='/auth/login' ml={2} color={'gray.300'}>Already have an account? Login here</Link>
      </Flex>
    </FormControl>
  )
}