'use client';
import { useSession } from 'next-auth/react';
import Header from '@/components/navbar/header';
import NavButtons from '@/components/nav-buttons';
import { Box, Container, Flex } from '@chakra-ui/react';
import Footer from '@/components/footer';
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
        <Header {...{
          userName: data?.user?.name as string,
          containerWidth: containerWidth
        }} />
      </WrapperBar>
      <Container maxW='container.lg'
        flexDirection={'column'} alignItems={'center'}
        display={'flex'}>
        <Flex mt={4} w={containerWidth} display='flex'>
          {children}
        </Flex>
        <WrapperBar as='footer'>
          <Footer containerWidth={containerWidth}/>
        </WrapperBar>
      </Container>
    </Box>
  );
}