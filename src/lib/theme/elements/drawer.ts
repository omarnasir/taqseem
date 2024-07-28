import { drawerAnatomy as parts } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys)

const transaction = definePartsStyle({
  header: {
    zIndex: 1700,
    _dark: {
      bg: 'bgModal',
      textAlign: 'center',
    },
  },
  dialog: {
    _dark: {
      bg: 'bgModal',
      backdropFilter: 'blur(20px)'
    },
  },
  body: {
    
  },
  footer: {

  },
  overlay: {
    _dark: {
      bg: 'blackAlpha.800',
    },
  }
})

const add = definePartsStyle({
  dialog: {
    _dark: {
      bg: 'rgba(77, 77, 90, 0.2)',
      backdropFilter: 'blur(20px)'
    },
  },
  overlay: {
    _dark: {
      bg: 'blackAlpha.800',
    },
  }
})

export const drawerTheme = defineMultiStyleConfig({
  variants: { transaction, add },
})