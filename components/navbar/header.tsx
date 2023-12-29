import {
  Image,
  Flex,
  HStack,
  Link,
} from '@chakra-ui/react';
import NavBarDrawer from './drawer-menu';

export default function NavBar(
  props: { userName: string }
) {

  const linkItems = [
    { name: 'Groups', href: '/groups' },
    { name: 'Activity', href: '/activity' },
    { name: 'Profile', href: '/profile' },
  ]

  return (
    <Flex w="100%"
      direction='row'
      px="0"
      py="4"
      borderBottom={'1px'} borderColor={'gray.600'}
      justify="space-between">
      <Link href='/'>
        <Image
          width={{base: 90, sm: 115}}
          src='/logo.png'
          alt={'taqseem'}/>
      </Link>
      <Flex display={{ base: 'none', md: 'flex' }} ml={6}>
        <HStack as="nav" spacing="5">
          {linkItems.map((linkItem, index) => (
            <Link key={index} href={linkItem.href}
              alignSelf={'center'}
              color={'gray.300'}>{linkItem.name}</Link>
          ))}
        </HStack>
      </Flex>
      <Flex w='100%' direction={'column'} alignItems={'flex-end'}>
        <NavBarDrawer {...{ userName: props.userName, linkItems: linkItems }} />
      </Flex>
    </Flex>
  );
}