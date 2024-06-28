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
  MdPerson,
} from 'react-icons/md';


export default function Footer() {
  const linkItems = [
    { name: 'Home', href: '/dashboard', icon: MdHomeFilled },
    { name: 'Groups', href: '/groups', icon: MdGroup },
    { name: 'Activity', href: '/activity', icon: MdNotifications },
    // { name: 'Profile', href: '/profile', icon: MdPerson },
  ]
  const pathname = usePathname()
  
  return (
    <Container flexDirection='row' display='flex' w='100%'
      paddingX={0}
      justifyContent={'space-evenly'}>
      {linkItems.map((linkItem, index) => (
        <Button key={index} href={linkItem.href} as={Link} w='100%' h='100%'
          variant='footer'
          borderTopColor={pathname.startsWith(linkItem.href) ? 'teal.500' : 'transparent'}
          borderTopWidth={pathname.startsWith(linkItem.href) ? 2 : 0}
          flexDirection={'column'}>
          <Icon as={linkItem.icon} boxSize={{base: 5, md: 6}} />
          <Text mt={2} fontSize={{base: 'xs', md: 'sm'}} display={{base: 'none', md: 'block'}}
          fontWeight={300}>{linkItem.name}</Text>
        </Button>
      ))}
    </Container>
  );
}