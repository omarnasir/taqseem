import { accordionAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(accordionAnatomy.keys)

const transaction = definePartsStyle({
  root: {
  },
  container: {
    border: 'none',
  },
  panel: {
    padding: 0,
    marginTop: -6,
  },
  button: {
    width: '100%',
    justifyContent: 'center',
  },
  icon: {
    color: 'gray.500',
  },
})

export const accordionTheme = defineMultiStyleConfig({
  variants: {
    transaction,
  },
})
