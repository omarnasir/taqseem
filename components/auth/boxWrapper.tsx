import { Box, BoxProps } from '@chakra-ui/react'

export function BoxWrapper(props: BoxProps) {
  return (<Box w={'100%'}
    {...props}
    justifyContent={'center'}
    display='flex'
    flexDirection='column'
    marginX={{ base: 0, md: 2 }}
    padding={{ base: 4, md: 6 }}
    boxShadow='dark-lg'
    borderWidth='0.1rem'
    borderColor={'gray.700'}
    borderRadius='0.5rem'
    mb={6}/>
  )
}