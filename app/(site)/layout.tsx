'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button, Container, Flex } from '@chakra-ui/react';
import { MdArrowBackIosNew } from "react-icons/md"
import Header from '@/components/navbar/header';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = useSession();
  const router = useRouter();

  return (
    <Container h='100vh' w={{base: '100%', md: '70%', lg: '50%'}} maxW='container.lg'>
      <Header {...{ userName: data?.user?.name as string }} />
      <Flex 
        w='100%'
        direction={'column'}
        alignItems={'flex-start'}
        px={{ base: 0, md: 2 }}>
          <Button marginY={2}
          leftIcon={<MdArrowBackIosNew size={15} />} 
          size='sm'
          onClick={() => router.back()}
          variant='ghost'>back</Button>
        {children}
      </Flex>
    </Container>
  );
}