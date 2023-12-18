'use client'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  Heading,
} from '@chakra-ui/react'
import { BoxWrapper } from '@/components/auth/boxWrapper';
import { useRouter } from 'next/navigation';

import { useForm, FieldValues } from "react-hook-form"
import { handleSignInAuth } from '@/app/login/authService';
import { CustomToast } from '@/app/utils/Toast';


export function Signin() {
  const router = useRouter();
  const { addToast } = CustomToast();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm()

  async function onSubmit(values: FieldValues) {
    const response = await handleSignInAuth({
      email: values.email,
      password: values.password,
    })
    if (response.success) {
      router.push('/dashboard')
      router.refresh()
    }
    else {
      addToast('Login Error. Check your details.', null, 'error');
    }
  }

  function onInvalidSubmit(errors: FieldValues) {
    console.log(errors)
  }

  return (
    <BoxWrapper as='form' onSubmit={handleSubmit(onSubmit, onInvalidSubmit)}>
      <Heading textAlign={'center'} fontSize={'1xl'} fontWeight={'light'} mb={2}>Sign in to continue</Heading>
        <FormControl isInvalid={!!errors?.email} mb={3}>
          <FormLabel htmlFor='email'>Email</FormLabel>
          <Input
            id='email'
            type='email'
            fontSize={'sm'}
            placeholder='email'
            {...register('email', {
              required: 'This is required',
            })}
            
          />
          {errors?.email &&
            <FormErrorMessage >
              {errors.email.message?.toString()}
            </FormErrorMessage>
          }
        </FormControl>
        <FormControl isInvalid={!!errors?.password} mb={3}>
          <FormLabel htmlFor='password'>Password</FormLabel>
          <Input
            id='password'
            type='password'
            placeholder='password'
            fontSize={'sm'}
            {...register('password', {
              required: 'This is required',
              minLength: {
                value: 4,
                message: 'Minimum length should be 4',
              },
            })}
          />
          {errors?.password &&
            <FormErrorMessage>
              {errors.password.message?.toString()}
            </FormErrorMessage>
          }
        </FormControl>
        <Button mt={4} 
        variant='solid'
        colorScheme='gray'
        bg='gray.300'
        textColor='green.900'
        isLoading={isSubmitting} 
        type='submit'>
          Login
        </Button>
    </BoxWrapper>
  )
}