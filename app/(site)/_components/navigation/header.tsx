import { useRouter } from 'next/navigation';

import { Image, Button, Flex, Link, IconButton, Container, Spacer } from "@chakra-ui/react";
import { MdOutlineArrowLeft } from "react-icons/md";
import NavbarMenu from './menu';


export default function Header(
  props: {
    userName: string | undefined
  }
) {
  const router = useRouter();
  const { userName } = props;

  return (
    <Container flexDirection='row' display='flex' w='100%'
      justifyContent={'space-between'}
      backdropFilter={'blur(20px)'}
      alignItems={'center'}>
      <IconButton mr={4}
        icon={<MdOutlineArrowLeft size={40} />}
        aria-label='back'
        onClick={() => router.back()}
        variant='headerButton'></IconButton>
      <Link href='/' alignSelf='center'>
        <Image
          w='50px'
          objectFit='fill'
          src='/logo.png'
          alt={'taqseem'} />
      </Link>
      <Spacer />
      <NavbarMenu {...{ userName: userName! }} />
    </Container>
  )
}