import { Box, Button, Link, Text } from "@chakra-ui/react";
import { FaGithub } from 'react-icons/fa';
export default function Footer() {
  return (
    <Box
      pos={'absolute'} bottom={0}
      display={'flex'}
      justifyContent={'flex-end'}
      alignItems={'center'}
      maxW='container.md' 
      w='100vw'
      bg='itemBgGray' p={4} borderTopWidth={1}
      borderWidth={1} >
      <Text fontSize='sm' fontWeight='300' color={'gray.400'}
      mr={4}>&copy; 2023 - taqseem</Text>
      <Button as={Link} variant='link'
      href='https://github.com/omarnasir/taqseem' isExternal 
      leftIcon={<FaGithub/>}/>
    </Box>
  )
}