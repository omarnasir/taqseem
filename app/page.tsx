import { Flex } from '@chakra-ui/react';
import { auth } from '@/app/api/auth/auth';

import DashboardPage from './dashboard/page';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  // const session = await auth();
  const session = await getServerSession(auth);

  if (!session) {
    redirect('/login')
  }

  return (
    <Flex
      w={'100%'}
      h={'100vh'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      {!!session && <DashboardPage />}
    </Flex>
  )
}