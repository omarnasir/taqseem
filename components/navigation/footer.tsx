import {
  Flex,
  Link,
  Button,
  Text,
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
          size={'lg'} h='9vh'
          alignSelf={'center'}
          variant='none'
          borderRadius={0}
          borderLeftWidth={index === 0 ? 0 : 1}
          borderColor={'gray.700'}
          colorScheme='loginbtn'
          flexDirection={'column'}>
          <linkItem.icon size={20} />
          <Text mt={2} fontSize={'sm'} fontWeight={300}>{linkItem.name}</Text>
        </Button>
      ))}
    </Flex>
  );
}