'use client';
import { useSession } from 'next-auth/react';
import { Box, Container, Flex } from '@chakra-ui/react';

import Footer from '@/components/navigation/footer';
import Header from '@/components/navigation/header';
import WrapperBar from '@/components/wrapper-bar';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = useSession();

  const containerWidth = {
    base: '92vw',
    md: '75vw',
    lg: '50vw',
    xl: '40vw',
  }

  return (
    <Box minW='100vw' h='100vh'>
      <WrapperBar as='header'>
        <Header {...{ containerWidth: containerWidth, userName: data?.user?.name}} />
      </WrapperBar>
      <Container maxW='container.lg'
        flexDirection={'column'} alignItems={'center'}
        display={'flex'}>
        <Flex mt={4} w={containerWidth} display='flex'>
          {children}
        </Flex>
        <WrapperBar as='footer'>
          <Footer {...{containerWidth: containerWidth}} />
        </WrapperBar>
      </Container>
    </Box>
  );
}