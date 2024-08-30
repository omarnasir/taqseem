import { Session } from 'next-auth';

import {
  MdLogout,
  MdOutlineMenu
} from 'react-icons/md';

import {
  IconButton,
  Text,
  Link,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList
} from "@chakra-ui/react";
import { signOutAction } from '@/server/actions/auth.action';


export default function NavbarMenu({ session }: { session: Session }) {
  return (
    <Menu closeOnBlur={true} offset={[-20, -100]} defaultIsOpen={true}>
      <MenuButton
        as={IconButton}
        aria-label='Options'
        variant='headerButton'
        icon={<MdOutlineMenu size={25} />} />
      <MenuList>
        <MenuGroup title={`Hello, ${session?.user?.name}`} fontSize={'md'}>
          <MenuItem fontSize={'sm'} as='button' padding={4}
            icon={<MdLogout />} onClick={async () => await signOutAction()}>Logout</MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  )
}