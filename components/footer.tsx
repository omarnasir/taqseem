import { Box, Button, Link, Text } from "@chakra-ui/react";
import { FaGithub } from 'react-icons/fa';


export default function Footer(
  props: { containerWidth: Record<string, string>,
  }
) {
  const { containerWidth } = props;
  return (
    <Box
      display={'flex'}
      justifyContent={'flex-end'}
      alignItems={'center'}
      maxW='container.md'
      w={containerWidth} p={4}>
      <Text fontSize='sm' fontWeight='300' color={'gray.400'}
        mr={4}>&copy; 2023 - taqseem</Text>
      <Button as={Link} variant='link'
        href='https://github.com/omarnasir/taqseem' isExternal
        leftIcon={<FaGithub />} />
    </Box>
  )
}