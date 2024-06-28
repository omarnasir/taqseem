import { menuAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(menuAnatomy.keys)

const baseStyle = definePartsStyle({
  list: {
   // _dark or _light
    _dark: {
      '--menu-bg': 'rgb(40,41,44)',
      'minWidth': '150px',
      'border': 'none'
    },
  },
  item: {
    _dark: { 
    }
  }
})

export const menuTheme = defineMultiStyleConfig({ baseStyle })
