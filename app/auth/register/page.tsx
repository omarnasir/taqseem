'use client'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  Heading,
  Flex,
  Link,
  Divider,
} from '@chakra-ui/react'
import { BoxWrapper } from '@/components/auth/box-wrapper';

import { useForm, FieldValues } from "react-hook-form"
import { handlerRegisterAuth } from '@/client/services/auth-service';
import { CustomToast } from '@/components/ui/toast';


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
      <FormControl isInvalid={!!errors?.name} mb={3}>
        <FormLabel htmlFor='name'>Name</FormLabel>
        <Input
          id='name'
          type='name'
          placeholder='name'
          {...register('name', {
            required: 'Please enter your name.',
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
          placeholder='email'
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
              message: 'Invalid email address',
            },
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
            required: 'Password is required',
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
      <Flex direction={'row'} justifyContent={'center'} mt={4}>
        <Link href='/auth/login' ml={2} color={'gray.300'}>Already have an account? Login here</Link>
      </Flex>
    </BoxWrapper>
  )
}