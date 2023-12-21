import { menuAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(menuAnatomy.keys)

const baseStyle = definePartsStyle({
  list: {
   // _dark or _light
    _dark: {
      '--menu-bg': 'colors.gray.900',
      'min-width': '150px',
    },
  },
  item: {
    _dark: {
    },
  }
})

export const menuTheme = defineMultiStyleConfig({ baseStyle })
