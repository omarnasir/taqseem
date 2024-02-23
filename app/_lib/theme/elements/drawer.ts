import { drawerAnatomy as parts } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys)

const transaction = definePartsStyle({
  header: {
  },
  dialog: {
    _dark: {
      bg: 'rgba(88, 87, 92, 0.22)',
      backdropFilter: 'blur(10px)'
    },
  },
  body: {

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