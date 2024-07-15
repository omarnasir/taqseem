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
    },
  },
})

const create = definePartsStyle({
  body: {
    pb: '6',
  },
  dialog: {
    top: '5vh',
    _dark: {
      bg: 'rgba(27,27,30, 0.9)',
      backdropFilter: 'blur(20px)',
      color: 'white',
      margin: 2,
    },
  },
})

export const modalTheme = defineMultiStyleConfig({
  variants: { transaction, confirm, create },
})