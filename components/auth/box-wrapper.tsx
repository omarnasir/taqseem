import {
  Box,
  BoxProps,
  Center,
  Container,
  Divider,
  Flex,
}
  from '@chakra-ui/react'
import Image from 'next/image'
import logo from '../../public/logo.png'

export function BoxWrapper(props: BoxProps) {
  const logoDims = 75;
  return (
    <Container>
      <Flex h='100vh' direction={'column'} justifyContent={'center'}>
        <Flex justifyContent={'space-evenly'}>
          <Center textAlign={'center'} fontSize={'3xl'} fontWeight={'light'}
            alignSelf={'center'} alignItems={'center'}>taqseem</Center>
          <Divider orientation="vertical" alignSelf={'center'}
            height={'1%'}
            borderWidth={'0.3rem'}
            borderRadius={'2rem'} />
          <Image priority={true}  src={logo} alt={'taqseem'} height={logoDims} width={0}/>
        </Flex>
        <Flex>
          <Box w={'100%'}
            {...props}
            justifyContent={'center'}
            display='flex'
            flexDirection='column'
            marginX={{ base: 0, md: 2 }}
            padding={{ base: 4, md: 6 }}
            borderWidth='0.1rem'
            borderColor={'gray.700'}
            borderRadius='0.5rem'
            mb={6} />
        </Flex>
      </Flex>
    </Container>
  )
}