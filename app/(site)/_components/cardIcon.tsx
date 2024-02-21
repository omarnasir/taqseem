import {
  Flex,
  Icon,
  FlexProps
} from '@chakra-ui/react'

export default function CustomCardIcon({ icon, styleProps }: { icon: any, styleProps?: FlexProps  }) {
  return (
    <Flex
      bg={'whiteAlpha.400'}
      opacity={0.7}
      rounded={'full'}
      boxSize={8}
      justifyContent={'center'}
      {...styleProps}
    >
      <Icon as={icon} alignSelf={'center'} boxSize={5}/>
    </Flex>
  )
}