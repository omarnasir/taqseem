import { Flex } from '@chakra-ui/react';
import { auth } from '@/app/api/auth/auth';

import DashboardPage from './dashboard/page';
import Login from "@/components/user/Login"
import { getServerSession } from 'next-auth';

export default async function Home() {
  // const session = await auth();
  const session = await getServerSession(auth);

  return (
    <Flex
      w={'100%'}
      h={'100vh'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      {!!session && <DashboardPage />}
      {!session && (
        <Flex
          flexDirection="row"
          justifyContent="center"
          alignItems="middle"
        >
          <Login />
        </Flex>
      )}
    </Flex>
  )
}