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
    footer: {
      base: '7.5vh',
      md: '8vh',
    }
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
        bg='bgHeader'
        w='100%'
        position='absolute'
        top={0}>
        <Header {...{ userName: data?.user?.name as string }} />
      </Flex>
      <Container
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
        borderTopRadius={'3xl'}
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