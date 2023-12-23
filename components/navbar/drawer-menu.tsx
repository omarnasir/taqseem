import {
  Menu,
  IconButton,
  MenuButton,
  MenuList,
  MenuGroup,
  MenuItem,
} from "@chakra-ui/react";
import { MdMenu, MdLogout } from 'react-icons/md'

import { handleSignOutAuth } from '@/client/services/authService';

export default function NavBarDrawer(props: { 
  userName: string,
  linkItems: { name: string, href: string }[]
 }) {
  return (
    <Menu closeOnBlur={true} gutter={0}>
      <MenuButton
        as={IconButton}
        aria-label='Options'
        icon={<MdMenu />}
        variant='outline' />
      <MenuList>
        <MenuGroup title={`Hello, ${props.userName}!`} fontSize={'lg'}>
          {props.linkItems.map((linkItem, index) => (
            <MenuItem key={index} as='a' href={linkItem.href} 
            color={'gray.200'}>{linkItem.name}</MenuItem>
          ))}
          <MenuItem as='button' icon={<MdLogout />} onClick={handleSignOutAuth}>Logout</MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  )
}