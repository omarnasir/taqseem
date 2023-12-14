import { Flex } from '@chakra-ui/react';
import { auth } from '@/auth';

import DashboardPage from './dashboard/page';
import Form from "@/app/user/Login"


export default async function Home() {
  const session = await auth();
  
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
          <Form />
        </Flex>
      )}
    </Flex>
  )
}