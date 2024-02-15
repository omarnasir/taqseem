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

  const heights = {
    header: '8vh',
    footer: '10vh',
  };

  return (
    <Container
      h='100vh'
      flexDirection={'column'} 
      alignItems={'center'}
      display={'flex'}>
      <Flex
        zIndex={1}
        height={heights.header}
        boxShadow={'lg'}
        bg='bgHeader'
        w='100%'
        position='absolute'
        top={0}>
        <Header {...{ userName: data?.user?.name }} />
      </Flex>
      <Container
        pt={3}

        flexDirection={'column'}
        position='absolute'
        overflow={'auto'}
        pb={heights.footer}
        top={heights.header}
        bottom={heights.footer}>
        {children}
      </Container>
      <Flex
        height={heights.footer}
        boxShadow={'dark-lg'}
        bg='bgFooter'
        w='100%'
        position='absolute'
        overflow={'hidden'}
        bottom={0}>
        <Footer />
      </Flex>
    </Container>
  );
}