import {
  Flex,
  Icon,
  FlexProps
} from '@chakra-ui/react'

function CustomCardIcon({ icon, styleProps }: { icon: any, styleProps?: FlexProps  }) {
return (
    <Flex
      bg={'whiteAlpha.400'}
      opacity={0.5}
      rounded={'md'}
      w={'3rem'}
      h={'2rem'}
      justifyContent={'center'}
      {...styleProps}
    >
      <Icon as={icon} alignSelf={'center'} boxSize={4}/>
    </Flex>
  )
}

function CustomFormIcon({ icon, styleProps }: { icon: any, styleProps?: FlexProps  }) {
  return (
    <Flex
      opacity={0.7}
      justifySelf={'center'}
      rounded={'full'}
      boxSize={6}
      width={'2.2rem'}
      height={'2rem'}
      justifyContent={'center'}
      {...styleProps}
    >
      <Icon as={icon} alignSelf={'center'} boxSize={4}/>
    </Flex>
  )
}

export {
  CustomCardIcon,
  CustomFormIcon
}