import { usePathname } from 'next/navigation'
import {
  MdHomeFilled,
  MdGroup,
  MdNotifications,
  MdLogout, 
  MdOutlineMenu
} from 'react-icons/md';

import {
  IconButton,
  Text,
  Link,
  useDisclosure,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList
} from "@chakra-ui/react";
import { signOutAction } from '@/app/_actions/auth';

export default function NavbarMenu(props: {
  userName: string
}) {

  const linkItems = [
    { name: 'Home', href: '/dashboard', icon: MdHomeFilled },
    { name: 'Groups', href: '/groups', icon: MdGroup },
    { name: 'Activity', href: '/activity', icon: MdNotifications },
    // { name: 'Profile', href: '/profile', icon: MdPerson },
  ]
  const pathname = usePathname()

  return (
    <Menu closeOnBlur={true} gutter={-4} >
      <MenuButton
        as={IconButton}
        aria-label='Options'
        variant='headerButton'
        icon={<MdOutlineMenu size={25} />} />
      <MenuList>
        <MenuGroup title={`Hello, ${props.userName}!`} fontSize={'md'}>
          {linkItems.map((linkItem, index) => (
            <MenuItem key={index} href={linkItem.href} as={Link}
              padding={4}
              fontSize={'sm'}
              bg={pathname === linkItem.href || (linkItem.href === '/groups' && pathname === '/transactions') ? 'teal.800' : 'transparent'}
              flexDirection={'row'}
              icon={<linkItem.icon/>}>
              <Text fontWeight={300}>{linkItem.name}</Text>
            </MenuItem>
          ))}
          <MenuItem fontSize={'sm'} as='button' padding={4}
          icon={<MdLogout />} onClick={async () => await signOutAction()}>Logout</MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  )
}