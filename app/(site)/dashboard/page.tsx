'use client';

import { useSession } from 'next-auth/react';

import Header from '@/components/navbar/header';
import { Container } from '@chakra-ui/react';

export default function DashboardPage() {
  const { data } = useSession();

  return (
    <Container h='100vh' w='100%' minW='100%'>
     <Header {...{ userName: data?.user?.name as string }} />
    </Container>
  );
}