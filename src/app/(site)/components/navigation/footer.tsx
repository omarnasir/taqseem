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
  ]
  const pathname = usePathname()
  
  return (
    <Container flexDirection='row' display='flex' w='100%'
      paddingX={0}
      justifyContent={'space-evenly'}>
      {linkItems.map((linkItem, index) => (
        <Button key={index} href={linkItem.href} as={Link} w='100%' h='100%'
          variant='footer'
          opacity={pathname.startsWith(linkItem.href) ? 1 : 0.5}
          color={pathname.startsWith(linkItem.href) ? 'whiteAlpha.900' : 'whiteAlpha.700'}
          flexDirection={'column'}>
          <Icon as={linkItem.icon} boxSize={{base: 5, md: 6}} />
          <Text variant={'footer'}>{linkItem.name}</Text>
        </Button>
      ))}
    </Container>
  );
}