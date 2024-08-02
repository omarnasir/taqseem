'use client';
import { Box, Container, Flex } from '@chakra-ui/react';

import Footer from '@/app/(site)/components/navigation/footer';

import { Session } from 'next-auth';

export default function AuthenticatedLayout({
  children
}: {
  children: React.ReactNode, session: Session
}) {
  const heights = {
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
        paddingX={4}
        flexDirection={'column'}
        overflow={'scroll'}
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