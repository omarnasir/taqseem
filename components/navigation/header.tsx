import { useRouter } from 'next/navigation';

import { Image, Button, Flex, Link } from "@chakra-ui/react";
import { MdArrowBackIosNew } from "react-icons/md";
import NavBarDrawer from './drawer-menu';


export default function Header(
  props: {
    containerWidth: Record<string, string>,
    userName: string | undefined
  }
) {
  const router = useRouter();
  const { userName, containerWidth } = props;

  return (
    <Flex direction={'row'}
      justifyContent={'space-between'}
      alignItems={'center'}
      marginY={2}
      w={containerWidth}>
      <Button
        leftIcon={<MdArrowBackIosNew size={18} />}
        size='xs'
        onClick={() => router.back()}
        variant='ghost'
        borderRadius={5}></Button>
      <Link href='/' alignSelf='center'>
        <Image
          w={{ md: '80px', sm: '125px', lg: '80px' }}
          objectFit='fill'
          src='/logo.png'
          alt={'taqseem'}/>
      </Link>
      <NavBarDrawer {...{ userName: userName! }} />
    </Flex>
  )
}