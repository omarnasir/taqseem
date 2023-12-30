import { useRouter } from 'next/navigation';

import { Flex, Button } from "@chakra-ui/react";
import { MdArrowBackIosNew, MdOutlineArrowForwardIos } from "react-icons/md";

export default function NavButtons() {
  const router = useRouter();

  return (
    <Flex direction={'row'}
      justifyContent={'space-between'} w='100%'>
      <Button marginY={2}
        ml={{ base: 0, md: 2, lg: 4 }}
        alignSelf={'flex-start'}
        leftIcon={<MdArrowBackIosNew size={15} />}
        size='xs'
        onClick={() => router.back()}
        variant='ghost'
        borderRadius={5}>prev</Button>
      <Button marginY={2}
        mr={{ base: 0, md: 2, lg: 4 }}
        alignSelf={'flex-end'}
        rightIcon={<MdOutlineArrowForwardIos size={15} />}
        size='xs'
        onClick={() => router.forward()}
        variant='ghost'
        borderRadius={5}>next</Button>
    </Flex>)
}