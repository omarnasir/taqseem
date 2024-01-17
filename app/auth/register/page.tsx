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
} from '@/components/auth/form-items';

import { useForm, FieldValues, FormProvider } from "react-hook-form"
import { handlerRegisterAuth } from '@/client/services/auth-service';
import { CustomToast } from '@/components/toast';


export default function Register() {
  const { addToast } = CustomToast();

  const methods = useForm()
  const { handleSubmit, formState } = methods

  async function onSubmit(values: FieldValues) {
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
      <FormProvider {...methods}>
        <NameFormItem />
        <EmailFormItem />
        <PasswordFormItem />
        <Button mt={4} isLoading={formState.isSubmitting} type='submit'>
          Register
        </Button>
      </FormProvider>
      <Flex direction={'row'} justifyContent={'center'} mt={4}>
        <Link href='/auth/login' ml={2} color={'gray.300'}>Already have an account? Login here</Link>
      </Flex>
    </BoxWrapper>
  )
}