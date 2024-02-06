import {
  Box,
  Center,
  Container,
  Divider,
  Flex,
}
  from '@chakra-ui/react'
import Image from 'next/image'
import logo from '@/public/logo.png'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const logoDims = 50;
  return (
    <Container>
      <Flex h='100vh' direction={'column'} justifyContent={'center'}>
        <Flex justifyContent={'space-evenly'} mb={3}>
          <Center textAlign={'center'} fontSize={'3xl'} fontWeight={'light'}
            alignSelf={'center'} alignItems={'center'}>taqseem</Center>
          <Divider orientation="vertical" alignSelf={'center'}
            height={'1%'}
            borderWidth={'0.3rem'}
            borderRadius={'2rem'} />
          <Image priority={true} src={logo} alt={'taqseem'} height={logoDims} width={0} />
        </Flex>
        <Flex>
          <Box w={'100%'}
            justifyContent={'center'}
            display='flex'
            flexDirection='column'
            marginX={{ base: 0, md: 2 }}
            padding={{ base: 4, md: 6 }}
            borderWidth='0.1rem'
            borderColor={'gray.700'}
            borderRadius='0.5rem'
            mb={6}>
          {children}
          </Box>
        </Flex>
      </Flex>
    </Container>
  )
}