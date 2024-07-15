'use client';
import { Container, Flex } from '@chakra-ui/react';

import Footer from '@/app/(site)/components/navigation/footer';
import Header from '@/app/(site)/components/navigation/header';
import NavbarMenu from '@/app/(site)/components/navigation/menu';

import { Session } from 'next-auth';

export default function AuthenticatedLayout({
  children, session
}: {
  children: React.ReactNode, session: Session
}) {
  const heights = {
    header: '8vh',
    footer: {
      base: '7vh',
      md: '7.5vh',
    }
  };

  return (<Container
      h='100vh'
      paddingX={0}
      flexDirection={'column'}
      alignItems={'center'}
      display={'flex'}>
      <Flex
        zIndex={1}
        height={heights.header}
        bg='bgHeader'
        w='100%'
        position='absolute'
        top={0}>
        <Header>
          <NavbarMenu session={session} />
        </Header>
      </Flex>
      <Container
        paddingX={2}
        flexDirection={'column'}
        position='absolute'
        overflow={'scroll'}
        pt={heights.header}
        sx={{
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none',
        }}
        pb={heights.footer}
        top={0}
        bottom={heights.footer}>
        {children}
      </Container>
      <Flex
        height={heights.footer}
        boxShadow={'dark-lg'}
        borderTopWidth={0}
        bg='bgFooter'
        borderBottomWidth={2}
        borderBottomColor='whiteAlpha.200'
        w='100%'
        position='absolute'
        overflow={'hidden'}
        bottom={0}>
        <Footer />
      </Flex>
    </Container>
  );
}