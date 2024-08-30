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
    <Container flexDirection='row' display='flex' w='100%' paddingX={0}>
      {linkItems.map((linkItem, index) => (
        <Button key={index} href={linkItem.href} as={Link}
          variant='footer'
          marginRight={pathname.includes('transactions')  && linkItem.name === 'Groups' ? 6 : 0}
          marginLeft={pathname.includes('transactions')  &&  linkItem.name === 'Activity' ? 6 : 0}
          color={pathname.startsWith(linkItem.href) ? 'white' : 'whiteAlpha.600'}>
          <Icon as={linkItem.icon} boxSize={{base: 5, md: 6}} />
          <Text variant={'footer'}>{linkItem.name}</Text>
        </Button>
      ))}
    </Container>
  );
}