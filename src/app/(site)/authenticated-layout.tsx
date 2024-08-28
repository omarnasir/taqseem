'use client';
import { Flex } from '@chakra-ui/react';

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

  return (
    <>
      <Flex
        h='100vh'
        direction={'column'}
        overflow={'scroll'}
        sx={{
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none',
        }}
        top={'2vh'}
        pb={heights.footer}>
        {children}
      </Flex>
      <Flex
        height={heights.footer}
        boxShadow={'dark-lg'}
        bg='bgFooter'
        borderWidth={0}
        w='100%'
        position='fixed'
        overflow={'hidden'}
        bottom={0}>
        <Footer />
      </Flex>
    </>
  );
}