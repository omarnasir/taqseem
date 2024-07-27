'use client';
import { Box, Container, Flex } from '@chakra-ui/react';

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

  return (<Box
      h='100vh'
      paddingX={0}
      flexDirection={'column'}
      alignItems={'center'}
      display={'flex'}>
      <Container
        paddingX={2}
        flexDirection={'column'}
        overflow={'scroll'}
        // pt={heights.header}
        sx={{
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none',
        }}
        top={'2vh'}
        position={'absolute'}
        pb={heights.footer}
        bottom={heights.footer}>
        {children}
      </Container>
      <Flex
        height={heights.footer}
        boxShadow={'dark-lg'}
        borderTopWidth={0}
        bg='bgFooter'
        borderBottomWidth={0}
        w='100%'
        position='fixed'
        overflow={'hidden'}
        bottom={0}>
      <Footer />
      </Flex>
    </Box>
  );
}