import { useRouter } from 'next/navigation';

import { Flex, Button } from "@chakra-ui/react";
import { MdArrowBackIosNew, MdOutlineArrowForwardIos } from "react-icons/md";

export default function NavButtons(
  props: { containerWidth: Record<string, string> }
) {
  const router = useRouter();
  const { containerWidth } = props;
  return (
    <Flex direction={'row'}
      justifyContent={'space-between'} w={containerWidth}>
      <Button marginY={2}
        alignSelf={'flex-start'}
        leftIcon={<MdArrowBackIosNew size={15} />}
        size='xs'
        onClick={() => router.back()}
        variant='ghost'
        borderRadius={5}>prev</Button>
      <Button marginY={2}
        alignSelf={'flex-end'}
        rightIcon={<MdOutlineArrowForwardIos size={15} />}
        size='xs'
        onClick={() => router.forward()}
        variant='ghost'
        borderRadius={5}>next</Button>
    </Flex>)
}