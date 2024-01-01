import {
  Flex,
  Link,
  Button,
} from '@chakra-ui/react';
import {
  MdHomeFilled,
  MdGroup,
  MdNotifications,
  MdPerson,
} from 'react-icons/md';
export default function Footer(
  props: { containerWidth: Record<string, string> }
) {
  const { containerWidth } = props;
  const linkItems = [
    { name: 'Home', href: '/', icon: MdHomeFilled },
    { name: 'Groups', href: '/groups', icon: MdGroup },
    { name: 'Activity', href: '/activity', icon: MdNotifications },
    { name: 'Profile', href: '/profile', icon: MdPerson },
  ]

  return (
    <Flex maxW='container.lg' w={containerWidth} direction='row'
      justifyContent={'space-evenly'}>
      {linkItems.map((linkItem, index) => (
        <Button key={index} href={linkItem.href} as={Link} w='100%'
          size={'lg'} h='10vh'
          alignSelf={'center'}
          variant='none'
          borderRadius={0}
          borderLeftWidth={index === 0 ? '1px' : '0px'}
          borderRightWidth={'1px'}
          borderColor={'gray.700'}
          colorScheme='loginbtn'
          leftIcon={<linkItem.icon size={18} />}
          >{linkItem.name}</Button>
      ))}
    </Flex>
  );
}