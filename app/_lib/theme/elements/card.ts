import { cardAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(cardAnatomy.keys)

const custom = definePartsStyle({
  container: {
    bg: 'bgCard',
    borderRadius: "8px",

  },
})

export const cardTheme = defineMultiStyleConfig({ 
  variants: {custom} 
})
