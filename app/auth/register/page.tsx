'use client'
import {
  Button,
  Heading,
  Flex,
  Link,
  Divider,
} from '@chakra-ui/react'
import { BoxWrapper } from '@/components/auth/box-wrapper';
import {
  NameFormItem,
  EmailFormItem,
  PasswordFormItem
} from '@/components/auth/form-item';

import { useForm, FieldValues } from "react-hook-form"
import { handlerRegisterAuth } from '@/client/services/auth-service';
import { CustomToast } from '@/components/toast';


export default function Register() {
  const { addToast } = CustomToast();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm()

  async function onSubmit (values: FieldValues) {
    const response = await handlerRegisterAuth({
      name: values.name,
      email: values.email,
      password: values.password,
    })
    if (!response.success) {
      addToast('Error in Registering', response.error, 'error');
    }
    else {
      addToast('Signup successful!', null, 'success')
    }
  };

  return (
    <BoxWrapper as='form' onSubmit={handleSubmit(onSubmit)}>
      <Heading textAlign={'left'} fontSize={'xl'} mb={4} fontWeight={'light'}>Signup</Heading>
      <Divider mb={4} />
      <NameFormItem {...{ errors, register }} />
      <EmailFormItem {...{ errors, register }} />
      <PasswordFormItem {...{ errors, register }} />
      <Button
        mt={4}
        bg={'gray.100'}
        colorScheme='loginbtn'
        textColor='blue.900'
        isLoading={isSubmitting}
        type='submit'>
        Register
      </Button>
      <Flex direction={'row'} justifyContent={'center'} mt={4}>
        <Link href='/auth/login' ml={2} color={'gray.300'}>Already have an account? Login here</Link>
      </Flex>
    </BoxWrapper>
  )
}