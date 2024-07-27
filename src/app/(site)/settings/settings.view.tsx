'use client'
import { signOutAction } from '@/server/actions/auth.action';
import {
  Button,
  Container,
  Heading
} from '@chakra-ui/react';
import { MdLogout } from 'react-icons/md';


export function SettingsView({ sessionData }: { sessionData: any }) {
  return (
    <Container>
      <Heading variant={'h1'}>{`Hello, ${sessionData?.user?.name}`}</Heading>
      <Button aria-label='Logout' variant={'add'} leftIcon={<MdLogout />}
        onClick={async () => await signOutAction()}>
        Logout
      </Button>
    </Container>
  )
}