'use client';
import { useSession } from 'next-auth/react';
import { Box, Container, Flex } from '@chakra-ui/react';

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
    <Box minW='100vw' h='100vh'>
      <Flex
        bg='itemBgGray'
        justify={'space-between'}
        w='100%'
        justifyContent='center'
        borderBottom='1px'
        borderColor='gray.800'>
        <Header {...{ containerWidth: containerWidth, userName: data?.user?.name }} />
      </Flex>
      <Container maxW='container.lg'
        flexDirection={'column'} alignItems={'center'}
        display={'flex'}>
        <Flex mt={3} w={containerWidth} display='flex'>
          {children}
        </Flex>
        <Flex
          bg='itemBgGray'
          justify={'space-between'}
          w='100%'
          justifyContent='center'
          borderTop='1px'
          borderColor='gray.800'
          position='absolute'
          bottom={0}>
          <Footer {...{ containerWidth: containerWidth }} />
        </Flex>
      </Container>
    </Box>
  );
}