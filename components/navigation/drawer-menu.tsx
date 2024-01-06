import {
  Menu,
  IconButton,
  MenuButton,
  MenuList,
  MenuGroup,
  MenuItem,
} from "@chakra-ui/react";
import { MdLogout, MdSettings } from 'react-icons/md'

import { handleSignOutAuth } from '@/client/services/auth-service';

export default function NavBarDrawer(props: { 
  userName: string
 }) {
  return (
    <Menu closeOnBlur={true} gutter={0}>
      <MenuButton
        size={'lg'}
        as={IconButton}
        aria-label='Options'
        icon={<MdSettings />}
        variant='none' />
      <MenuList>
        <MenuGroup title={`Hello, ${props.userName}!`} fontSize={'lg'}>
          <MenuItem as='button' icon={<MdLogout />} onClick={handleSignOutAuth}>Logout</MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  )
}