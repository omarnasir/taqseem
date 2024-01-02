'use client'
import {
  Button,
  Heading,
  Flex,
  Link,
  Divider
} from '@chakra-ui/react'
import { BoxWrapper } from '@/components/auth/box-wrapper';
import {
  EmailFormItem,
  PasswordFormItem
} from '@/components/auth/form-item';

import { useForm, FieldValues } from "react-hook-form"
import { handleSignInAuth } from '@/client/services/auth-service';
import { CustomToast } from '@/components/toast';


export default function Signin() {
  const { addToast } = CustomToast();

  const {
    handleSubmit,
    register,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm()

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
      <EmailFormItem {...{errors, register,}} />
      <PasswordFormItem {...{errors, register,}} />
      <Button mt={4}
        bg={'gray.100'}
        colorScheme='loginbtn'
        textColor='green.900'
        isLoading={isSubmitting}
        type='submit'>
        Login
      </Button>
      <Flex direction={'row'} justifyContent={'center'} mt={4}>
        <Link href='/auth/register' ml={2} color={'gray.300'}>New User? Register here</Link>
      </Flex>
    </BoxWrapper>
  )
}