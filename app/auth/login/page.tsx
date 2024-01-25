'use client'
import {
  Button,
  Heading,
  Flex,
  Link,
  Divider
} from '@chakra-ui/react'
import { BoxWrapper } from '../_components/box-wrapper';
import {
  EmailFormItem,
  PasswordFormItem
} from '@/app/auth/_components/form-items';

import { useForm, FieldValues, FormProvider } from "react-hook-form"
import { handleSignInAuth } from '@/client/services/auth-service';
import { CustomToast } from '@/components/toast';


export default function Signin() {
  const { addToast } = CustomToast();

  const methods = useForm()
  const { handleSubmit, formState, clearErrors } = methods

  async function onSubmit(values: FieldValues) {
    clearErrors()
    const response = await handleSignInAuth({
      email: values.email,
      password: values.password,
    })
    if (!response) {
      addToast('Login Error. Check your details.', null, 'error');
    }
  }

  return (
    <BoxWrapper as='form' onSubmit={handleSubmit(onSubmit)}>
      <Heading textAlign={'left'} fontSize={'xl'} mb={4} fontWeight={'light'}>Login</Heading>
      <Divider mb={4} />
      <FormProvider {...methods}>
        <EmailFormItem />
        <PasswordFormItem />
        <Button mt={4} isLoading={formState.isSubmitting} type='submit'>
          Login
        </Button>
      </FormProvider>
      <Flex direction={'row'} justifyContent={'center'} mt={4}>
        <Link href='/auth/register' ml={2} color={'gray.300'}>New User? Register here</Link>
      </Flex>
    </BoxWrapper>
  )
}