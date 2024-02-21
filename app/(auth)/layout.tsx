import {
  Box,
  Card,
  CardBody,
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
          <Card w={'100%'}
            variant={'infoCard'}
            boxShadow={'dark-lg'}>
            <CardBody
              justifyContent={'center'}
              display='flex'
              flexDirection='column'
              marginX={{ base: 0, md: 2 }}
              padding={6}>
              {children}
            </CardBody>
          </Card>
        </Flex>
      </Flex>
    </Container>
  )
}