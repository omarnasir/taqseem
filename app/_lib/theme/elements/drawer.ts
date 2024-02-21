import { drawerAnatomy as parts } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys)

const transaction = definePartsStyle({
  dialog: {
    _dark: {
      bg: 'bgModal',
      color: 'white',
      width: {
        base: '100%',
        md: '70%',
        lg: '60%',
        xl: '40vw',
      },
      left: 'auto !important',
      right: 'auto !important',
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

export const drawerTheme = defineMultiStyleConfig({
  variants: { transaction },
})