'use client'
import {
  Button,
  Heading,
  Flex,
  Link,
  Divider,
  FormControl
} from '@chakra-ui/react'
import { useForm, FieldValues, FormProvider } from "react-hook-form"

import { EmailFormItem, PasswordFormItem } from '@/app/(auth)/_components/form-items';
import { signInAction } from '@/app/_actions/auth';
import { CustomToast } from '@/app/_components/toast';


export default function Signin() {
  const { addToast } = CustomToast();

  const methods = useForm()
  const { handleSubmit, formState, clearErrors } = methods

  async function onSubmit(values: FieldValues) {
    clearErrors()
    try {
      await signInAction({
        email: values.email,
        password: values.password,
      })
    } catch (error) {
      addToast('Login Error. Check your details.', null, 'error');
    }
  }

  return (
    <FormControl as='form' onSubmit={handleSubmit(onSubmit)}>
      <Heading textAlign={'left'} fontSize={'lg'} mb={4} fontWeight={'light'}>Login</Heading>
      <Divider mb={4} />
      <FormProvider {...methods}>
        <EmailFormItem />
        <PasswordFormItem />
        <Button mt={4} w='100%' isLoading={formState.isSubmitting} type='submit' variant={'login'}>
          Login
        </Button>
      </FormProvider>
      <Flex direction={'row'} justifyContent={'center'} mt={6}>
        <Link href='/register' ml={2} color={'gray.300'}>New User? Register here</Link>
      </Flex>
    </FormControl>
  )
}