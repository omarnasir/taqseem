import { useRouter } from 'next/navigation';

import { Image, Link, IconButton, Container, Spacer } from "@chakra-ui/react";
import { MdOutlineArrowLeft } from "react-icons/md";


export default function Header({children}: {children: React.ReactNode}) {
  const router = useRouter();

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
          w='42px'
          objectFit='fill'
          src='/logo.png'
          alt={'taqseem'} />
      </Link>
      <Spacer />
      {children}
    </Container>
  )
}