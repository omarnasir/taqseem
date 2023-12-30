import { useRouter } from 'next/navigation';

import { Box, Button, Flex, Link, Text } from "@chakra-ui/react";
import { FaGithub } from 'react-icons/fa';
import { MdArrowBackIosNew, MdOutlineArrowForwardIos } from "react-icons/md";


export default function Footer(
  props: {
    containerWidth: Record<string, string>,
  }
) {
  const router = useRouter();

  const { containerWidth } = props;
  return (
    <Flex direction={'row'}
      justifyContent={'space-between'}
      alignItems={'center'}
      marginY={2}
      w={containerWidth}>
      <Button
        leftIcon={<MdArrowBackIosNew size={15} />}
        size='xs'
        onClick={() => router.back()}
        variant='ghost'
        borderRadius={5}>prev</Button>
      <Flex direction={'row'} alignItems={'center'}>
        <Text fontSize='sm' fontWeight='300' color={'gray.400'}
          mr={4}>&copy; 2023 - taqseem</Text>
        <Button as={Link} variant='link'
          href='https://github.com/omarnasir/taqseem' isExternal
          leftIcon={<FaGithub />} />
      </Flex>
      <Button
        rightIcon={<MdOutlineArrowForwardIos size={15} />}
        size='xs'
        onClick={() => router.forward()}
        variant='ghost'
        borderRadius={5}>next</Button>
    </Flex>
  )
}