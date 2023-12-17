'use client';

import {
  Flex,
  Heading,
  Input,
  Button,
  Center,
  Box,
  useColorModeValue,
  Image,
  Divider,
} from '@chakra-ui/react';
import { signIn } from 'next-auth/react';
import { useRouter, redirect } from 'next/navigation';
import { FormEvent } from 'react';
import { CustomToast } from '@/app/utils/Toast';


interface LoginData {
  email: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
}

const headerHeight = '75px';

export default function Login() {
  const router = useRouter();
  const { addToast } = CustomToast();

  async function handleSignInAuth(
    { email, password }: LoginData
  ) {
    // try {
    let response = await signIn('credentials', {
      email: email,
      password: password,
      callbackUrl: '/',
      redirect: false,
    });
    if (response?.ok) {
      router.push('/');
      router.refresh();
    }
    else {
      console.log(response?.error)
      throw new Error();
    }
  }
  // catch (error) {
  //   console.log(error)
  //   throw new Error('Unexpected error in signin');
  // }

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
        await handleSignInAuth({
          email: formData.get('registerEmail'),
          password: formData.get('registerPassword'),
        })
    }
    else {
      // Parse the response body as JSON
      const body = await response.json();
      addToast('Error in Registering', body.message, 'error');
    }
  };

  return (
        <Flex w={{ base: '100vw', lg: '100vw' }} minH='100vh' direction={'column'}
        justifyContent={'center'}>
          <Flex direction={'row'} w='100%' h={headerHeight} maxH={headerHeight} justifyContent={'space-evenly'}>
          <Center textAlign={'center'} fontSize={'3xl'} fontWeight={'light'}
          alignSelf={'center'} alignItems={'center'}
          >taqseem</Center>
          <Divider orientation="vertical" h={'5vh'} alignSelf={'center'}/>
          <Image src={'/logo.png'} alt={'taqseem'} h={headerHeight} />
          </Flex>
          <Flex
            w={'100%'}
            paddingX={{ base: 4, sm: 10, md: 8, lg: 6 }}
            flexDirection={{ base: 'column', md: 'row'}}
            alignItems="stretch">
              <Box as="form"
              w={'100%'} justifyContent={'flex-end'}
              marginX={{ base: 2, md: 2 }} mb={{ base: 4}}
              padding={{ base: 4, md: 6 }}
              bg={useColorModeValue('white.100', 'blue.800')}
              borderRadius={12} boxShadow="none"
                display="flex" flexDirection="column" onSubmit={handleLogin}>
                <Heading textAlign={'center'} fontSize={'3xl'} fontWeight={'light'} mb={6}>Log In</Heading>
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
                <Button colorScheme="blue" mb={8} type='submit'>
                  Log In
                </Button>
              </Box>
              <Box as="form" onSubmit={handleRegister}
                w={'100%'}
                marginX={{ base: 2, md: 2 }} mb={{ base: 4}}
                padding={{ base: 4, md: 6 }}
                bg={useColorModeValue('white.100', 'green.800')}
                borderRadius={12}
                boxShadow="none"
                  display="flex" flexDirection="column" >
                <Heading mb={6} textAlign={'center'} fontSize={'3xl'} fontWeight={'light'}>Register</Heading>
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
                <Button colorScheme="teal" type='submit' variant='outline'>
                  Register
                </Button>
              </Box >
          </Flex>
        </Flex>
  );
}