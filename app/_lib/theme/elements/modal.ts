import { modalAnatomy as parts } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys)

const custom = definePartsStyle({
  dialog: {
    borderRadius: 'md',
    borderWidth: '1px',
    borderColor: 'gray.700',
    
    // Let's also provide dark mode alternatives
    _dark: {
      bg: 'black',
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