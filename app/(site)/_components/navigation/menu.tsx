import { usePathname } from 'next/navigation'
import {
  MdHomeFilled,
  MdGroup,
  MdNotifications,
  MdPerson,
} from 'react-icons/md';

import {
  IconButton,
  Text,
  Link,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Button,
  VStack,
  HStack,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList
} from "@chakra-ui/react";
import {
  MdLogout, MdOutlineMenu, MdCancel
} from 'react-icons/md'

import { handleSignOutAuth } from '@/app/(auth)/_lib/auth-service';

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

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    // <>
    //   <IconButton
    //     aria-label='Options'
    //     variant='headerButton'
    //     onClick={onOpen}
    //     icon={<MdOutlineMenu size={25} />} />
    //   <Drawer isOpen={isOpen} placement='bottom' onClose={onClose}
    //     variant={'menu'} size={'full'}>
    //     <DrawerOverlay />
    //     <DrawerContent maxWidth={{ base: '250px', md: '400px' }}
    //       maxHeight={{ base: '125px', md: '400px' }}>
    //       <DrawerHeader borderBottomWidth='1px' fontSize={'md'}
    //       >{`Hello, ${props.userName}!`}</DrawerHeader>
    //       <DrawerBody>
    //         <HStack w='100%'>
    //           {linkItems.map((linkItem, index) => (
    //             <Button key={index} href={linkItem.href} as={Link}
    //               w='100%'
    //               fontSize={'sm'}
    //               bg={pathname === linkItem.href || (linkItem.href === '/groups' && pathname === '/transactions') ? 'teal.800' : 'transparent'}
    //               leftIcon={<linkItem.icon />}>
    //               <Text fontWeight={300}>{linkItem.name}</Text>
    //             </Button>
    //           ))}
    //           <Button fontSize={'sm'} as='button' w='100%'
    //             leftIcon={<MdLogout />} onClick={handleSignOutAuth}>Logout</Button>
    //         </HStack>
    //       </DrawerBody>
    //       <IconButton
    //         aria-label='Close'
    //         variant='headerButton'
    //         onClick={onClose}
    //         position='fixed'
    //         top={4}
    //         right={4}
    //         icon={<MdCancel size={25} />} />
    //     </DrawerContent>
    //   </Drawer>
    // </>
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
          icon={<MdLogout />} onClick={handleSignOutAuth}>Logout</MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  )
}