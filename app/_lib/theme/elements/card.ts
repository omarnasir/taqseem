import { cardAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(cardAnatomy.keys)

const custom = definePartsStyle({
  container: {
    bg: 'bgCard',
    boxShadow: '0px 6px 12px 1px rgb(20,20,20)',
  },
})

export const cardTheme = defineMultiStyleConfig({ 
  variants: {custom} 
})
