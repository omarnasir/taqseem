import {
  Box,
  Flex,
  Icon
} from '@chakra-ui/react'

export default function CustomCardIcon({ icon, }: { icon: any  }) {
  return (
    <Flex
      bg={'whiteAlpha.400'}
      opacity={0.7}
      rounded={'full'}
      boxSize={8}
      justifyContent={'center'}
    >
      <Icon as={icon} alignSelf={'center'}/>
    </Flex>
  )
}