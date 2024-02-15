import {
  Flex,
  Link,
  Button,
  Text,
  Container,
} from '@chakra-ui/react';
import {
  MdHomeFilled,
  MdGroup,
  MdNotifications,
  MdPerson,
} from 'react-icons/md';


export default function Footer() {
  const linkItems = [
    { name: 'Home', href: '/', icon: MdHomeFilled },
    { name: 'Groups', href: '/groups', icon: MdGroup },
    { name: 'Activity', href: '/activity', icon: MdNotifications },
    { name: 'Profile', href: '/profile', icon: MdPerson },
  ]

  return (
    <Container flexDirection='row' display='flex' w='100%'
      paddingX={0}
      justifyContent={'space-evenly'}>
      {linkItems.map((linkItem, index) => (
        <Button key={index} href={linkItem.href} as={Link} w='100%'
          size={'lg'} h='9vh'
          alignSelf={'center'}
          variant='none'
          colorScheme='loginbtn'
          flexDirection={'column'}>
          <linkItem.icon size={25} />
          <Text mt={2} fontSize={'sm'} fontWeight={300}>{linkItem.name}</Text>
        </Button>
      ))}
    </Container>
  );
}