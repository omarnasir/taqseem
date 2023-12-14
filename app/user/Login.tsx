'use client';

import {
  Flex,
  Heading,
  Input,
  Button,
  Box,
  Divider,
  useColorModeValue,
  FormControl,
} from '@chakra-ui/react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { CustomToast } from '../utils/Toast';


interface LoginData {
  email: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
}

export default function Form() {
  const router = useRouter();
  const formBackground = useColorModeValue('gray.100', 'gray.700');

  const { addToast } = CustomToast();

  async function handleSignInAuth(
    { email, password }: LoginData
  ) {
    const response = await signIn('credentials', {
      email: email,
      password: password,
      redirect: true,
    });
    console.log({response});
    if (!response?.error) {
      router.push('/');
      router.refresh();
    }
    else {
      console.log(response);
      throw new Error();
    }
  }

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await handleSignInAuth({
        email: formData.get('loginEmail'),
        password: formData.get('loginPassword'),
      })
    }
    catch (error) {
      addToast('Invalid username or password', null, 'error');
    }
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const response = await fetch(`/api/auth/register`, {
      method: 'POST',
      body: JSON.stringify({
        name: formData.get('registerName'),
        email: formData.get('registerEmail'),
        password: formData.get('registerPassword'),
      }),
    });
    if (response.ok) {
      addToast('User registered successfully!', null, 'success')
      try {
        await handleSignInAuth({
          email: formData.get('registerEmail'),
          password: formData.get('registerPassword'),
        })
      }
      catch (error) {
        throw new Error('Unexpected error in signin');
      }
    }
    else {
      // Parse the response body as JSON
      const body = await response.json();
      // setInputRegister(body.message);
      addToast('Error in Registering', body.message, 'error');
    }
  };

  return (
    <Flex h="50%"
      direction="column"
      alignItems="center" justifyContent="center"
      bg={formBackground}
      p={12}
      borderRadius={12}
      boxShadow="lg" >
      <Heading mb={6} fontSize={'2xl'} >Welcome to Taqseem</Heading>
      <Divider mb={6} />
      <FormControl>
        <Box as="form"
          display="flex" flexDirection="column" alignItems="center"
          onSubmit={handleLogin}>
          <Heading fontSize={'2xl'} mb={6}>Log In</Heading>
          <Input
            id="loginEmail"
            name="loginEmail"
            placeholder="Email"
            type="email"
            variant="filled"
            mb={3}
          />
          <Input
            id="loginPassword"
            name="loginPassword"
            placeholder="Password"
            type="password"
            variant="filled"
            mb={6}
          />
          <Button colorScheme="teal" mb={8} type='submit'>
            Log In
          </Button>
        </Box>
      </FormControl>
      <Divider mb={6} />
      <FormControl>
        <Box as="form" onSubmit={handleRegister}
          display="flex" flexDirection="column" alignItems="center">
          <Heading mb={6} fontSize={'2xl'} >Register</Heading>
          <Input
            id="registerName"
            name="registerName"
            placeholder="Name"
            type="name"
            variant="filled"
            required
            mb={3}
          />
          <Input
            id="registerEmail"
            name="registerEmail"
            placeholder="Email"
            type="email"
            variant="filled"
            required
            mb={3}
          />
          <Input
            id="registerPassword"
            name="registerPassword"
            placeholder="Password"
            type="password"
            variant="filled"
            required
            mb={6}
          />
          <Button colorScheme="red" type='submit'>
            Register
          </Button>
        </Box >
      </FormControl>
    </Flex >
  );
}