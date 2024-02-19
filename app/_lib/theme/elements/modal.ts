import { modalAnatomy as parts } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys)

const transaction = definePartsStyle({
  dialog: {
    _dark: {
      bg: 'bgModal',
      color: 'white',
      textAlign: 'start',
    },
  },
  body: {
    _dark: {
      color: 'whiteAlpha.800',
    },
  },
  overlay: {
    _dark: {
      bg: 'blackAlpha.900',
    },
  }
})

const confirm = definePartsStyle({
  dialog: {
    _dark: {
      bg: 'bgModal',
      color: 'white',
      margin: '4',
    },
  },
})

export const modalTheme = defineMultiStyleConfig({
  variants: { transaction, confirm },
})