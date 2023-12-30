'use client';
import { useSession } from 'next-auth/react';
import Header from '@/components/navbar/header';
import NavButtons from '@/components/nav-buttons';
import { Container, Flex } from '@chakra-ui/react';
import Footer from '@/components/footer';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = useSession();

  return (
    <Container h='100vh' maxW='container.lg'
      flexDirection={'column'} alignItems={'center'}
      display={'flex'}>
      <Header {...{ userName: data?.user?.name as string }} />
      <NavButtons/>
      <Flex mt={1}
      w={{
        base: '92vw',
        md: '75vw',
        lg: '50vw',
        xl: '40vw',
      }} display='flex'>
        {children}
      </Flex>
      <Footer />
    </Container>
  );
}