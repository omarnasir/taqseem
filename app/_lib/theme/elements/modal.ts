import { modalAnatomy as parts } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys)

const custom = definePartsStyle({
  dialog: {
    _dark: {
      bg: 'bgModal',
      color: 'white',
    },
  },
})

export const modalTheme = defineMultiStyleConfig({
  variants: { custom },
  defaultProps: {
    variant: 'custom',
  },
})