'use client';

import { useSession } from 'next-auth/react';

import Header from '@/components/navbar/header';
import { Container, Flex } from '@chakra-ui/react';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = useSession();

  return (
    <Container h='100vh' w={{base: '100%', md: '80%'}} maxW='container.lg'>
      <Header {...{ userName: data?.user?.name as string }} />
      <Flex 
        w='100%'
        direction={'column'}
        alignItems={'flex-start'}
        pt={6}
        px={{ base: 0, md: 2 }}>
        {children}
      </Flex>
    </Container>
  );
}