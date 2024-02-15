import {
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  MenuItem,
  Button,
  IconButton,
} from "@chakra-ui/react";
import { MdLogout, MdSettings } from 'react-icons/md'

import { handleSignOutAuth } from '@/app/(auth)/_lib/auth-service';

export default function NavbarMenu(props: { 
  userName: string
 }) {
  return (
    <Menu closeOnBlur={true} gutter={0} >
      <MenuButton
        as={IconButton}
        aria-label='Options'
        variant='headerButton'
        icon={<MdSettings />} />
      <MenuList mr={4}>
        <MenuGroup title={`Hello, ${props.userName}!`} fontSize={'lg'}>
          <MenuItem as='button' icon={<MdLogout />} onClick={handleSignOutAuth}>Logout</MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  )
}