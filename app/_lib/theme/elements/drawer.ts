import { drawerAnatomy as parts } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys)

const transaction = definePartsStyle({
  header: {

  },
  dialog: {
    _dark: {
      bg: 'rgba(78, 77, 82, 0.1)',
      backdropFilter: 'blur(20px)'
    },
  },
  body: {
    
  },
  footer: {

  },
  overlay: {
    _dark: {
      bg: 'blackAlpha.700'
    },
  }
})

export const drawerTheme = defineMultiStyleConfig({
  variants: { transaction },
})