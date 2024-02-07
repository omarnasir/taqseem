'use client';
import { useSession } from 'next-auth/react';
import { Container, Flex } from '@chakra-ui/react';

import Footer from '@/app/(site)/_components/navigation/footer';
import Header from '@/app/(site)/_components/navigation/header';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = useSession();

  const containerWidth = {
    base: '92vw',
    md: '70vw',
    lg: '50vw',
    xl: '40vw',
  }

  return (
    <Flex minW='100vw' h='100vh' flexDir='column'>
      <Flex
        justify={'space-between'}
        w='100%'
        justifyContent='center'>
        <Header {...{ containerWidth: containerWidth, userName: data?.user?.name }} />
      </Flex>
      <Container maxW='container.lg'
        flexDirection={'column'} alignItems={'center'}
        display={'flex'}>
        <Flex mt={3} w={containerWidth} display='flex'>
          {children}
        </Flex>
        <Flex
          boxShadow={'dark-lg'}
          bg='bgFooter'
          justify={'space-between'}
          w='100%'
          justifyContent='center'
          position='absolute'
          bottom={0}>
          <Footer {...{ containerWidth: containerWidth }} />
        </Flex>
      </Container>
    </Flex>
  );
}