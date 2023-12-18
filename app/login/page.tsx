'use client';

import {
  Flex,
  Center,
  Image,
  Divider,
  Container,
} from '@chakra-ui/react';

import { Signin } from './signin';
import { Register } from './register';

export default function Login() {
  const headerHeight = '75px';

  return (
    <Container w={{ base: '100vw', md:'75vw', lg: '75vw' }}
    minW={{ base: '100%', md:'75%', lg: '75%', xl: '50%' }}>
      <Flex 
        minH='100vh'
        direction={'column'}
        justifyContent={'center'}>
        <Flex w='100%'
          direction={'row'}
          justifyContent={'space-evenly'}>
          <Center textAlign={'center'} fontSize={'3xl'} fontWeight={'light'}
            alignSelf={'center'} alignItems={'center'}>taqseem</Center>
        <Divider orientation="vertical" alignSelf={'center'} 
          borderWidth={'0.2rem'}
          borderRadius={'2rem'}/>
          <Image src={'/logo.png'} alt={'taqseem'} h={headerHeight} />
        </Flex>
        <Flex
          w={'100%'}
          paddingX={{ base: 4, sm: 10, md: 4, lg: 6 }}
          flexDirection={{ base: 'column', md: 'row' }}
          alignItems="stretch">
          <Signin />
          <Register />
        </Flex>
      </Flex>
    </Container>
  );
}