import {
  Image,
  Flex,
  HStack,
  Link,
} from '@chakra-ui/react';
import NavBarDrawer from './drawer-menu';

export default function NavBar(
  props: { userName: string, containerWidth: Record<string, string> }
) {
  const { userName, containerWidth } = props;

  const linkItems = [
    { name: 'Groups', href: '/groups' },
    { name: 'Activity', href: '/activity' },
    { name: 'Profile', href: '/profile' },
  ]

  return (
    <Flex maxW='container.lg' w={containerWidth} direction='row'
      px="0"
      py="3">
      <Link href='/' alignSelf='center'>
        <Image
          w={{ md: '100px', sm: '150px', lg: '100px' }}
          objectFit='fill'
          src='/logo.png'
          alt={'taqseem'}/>
      </Link>
      <Flex display={{ base: 'flex', md: 'flex' }} ml={6}>
        <HStack as="nav" spacing="5">
          {linkItems.map((linkItem, index) => (
            <Link key={index} href={linkItem.href}
              alignSelf={'center'}
              color={'gray.300'}>{linkItem.name}</Link>
          ))}
        </HStack>
      </Flex>
      <Flex w='100%' direction={'column'} alignItems={'flex-end'}>
        <NavBarDrawer {...{ userName: userName, linkItems: linkItems }} />
      </Flex>
    </Flex>
  );
}