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

import { useForm, FieldValues } from "react-hook-form"
import { handlerRegisterAuth } from '@/app/login/authService';
import { CustomToast } from '@/components/ui/Toast';


export function Register() {
  const { addToast } = CustomToast();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (values: FieldValues) => {
    const response = await handlerRegisterAuth({
      name: values.name,
      email: values.email,
      password: values.password,
    })
    if (response.success) {
      addToast('User registered successfully!', null, 'success')
    }
    else {
      addToast('Error in Registering', response.message, 'error');
    }

  };

  return (
    <BoxWrapper as='form' onSubmit={handleSubmit(onSubmit)}>
      <Heading textAlign={'center'} fontSize={'1xl'} fontWeight={'light'} mb={2}>Sign up Here</Heading>
      <FormControl isInvalid={!!errors?.name} mb={3}>
        <FormLabel htmlFor='name'>Name</FormLabel>
        <Input
          id='name'
          type='name'
          placeholder='name'
          {...register('name', {
            required: 'This is required',
            minLength: {
              value: 2,
              message: 'Minimum length should be 2',
            },
          })}
        />
        {errors?.name &&
          <FormErrorMessage>
            {errors.name.message?.toString()}
          </FormErrorMessage>
        }
      </FormControl>
      <FormControl isInvalid={!!errors?.email} mb={3}>
        <FormLabel htmlFor='email'>Email</FormLabel>
        <Input
          id='email'
          type='email'
          placeholder='email'
          {...register('email', {
            required: 'This is required',
          })}
        />
        {errors?.email &&
          <FormErrorMessage>
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
      <Button
        mt={4}
        bg={'gray.100'}
        colorScheme='loginbtn'
        textColor='blue.900'
        isLoading={isSubmitting}
        type='submit'>
        Register
      </Button>
    </BoxWrapper>
  )
}