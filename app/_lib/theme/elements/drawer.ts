import { drawerAnatomy as parts } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys)

const transaction = definePartsStyle({
  header: {
    bg: 'rgb(17,17,17)',
  },
  dialog: {
    _dark: {
      bg: 'rgba(88, 87, 92, 0.15)',
      backdropFilter: 'blur(10px)'
    },
  },
  body: {
    
  },
  footer: {
    bg: 'rgb(17,17,17)',
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