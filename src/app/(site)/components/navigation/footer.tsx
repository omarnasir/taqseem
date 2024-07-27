 import { usePathname } from 'next/navigation'

import {
  Link,
  Button,
  Text,
  Icon,
  Container,
} from '@chakra-ui/react';
import {
  MdHomeFilled,
  MdGroup,
  MdNotifications,
  MdSettings
} from 'react-icons/md';



export default function Footer() {
  const linkItems = [
    { name: 'Home', href: '/dashboard', icon: MdHomeFilled },
    { name: 'Groups', href: '/groups', icon: MdGroup },
    { name: 'Activity', href: '/activity', icon: MdNotifications },
    { name: 'Settings', href: '/settings', icon:  MdSettings },
  ]
  const pathname = usePathname()
  
  return (
    <Container flexDirection='row' display='flex' w='100%'
      paddingX={0}
      justifyContent={'space-evenly'}>
      {linkItems.map((linkItem, index) => (
        <Button key={index} href={linkItem.href} as={Link}
          variant='footer'
          color={pathname.startsWith(linkItem.href) ? 'white' : 'whiteAlpha.600'}>
          <Icon as={linkItem.icon} boxSize={{base: 5, md: 6}} />
          <Text variant={'footer'}>{linkItem.name}</Text>
        </Button>
      ))}
      {/* <Button aria-label='Logout' variant='footer'
        onClick={async () => await signOutAction()}>
        <Icon as={MdLogout} boxSize={{base: 5, md: 6}} />
        <Text variant={'footer'}>Logout</Text>
      </Button> */}
    </Container>
  );
}