import { cardAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(cardAnatomy.keys)

const custom = definePartsStyle({
  container: {
    bg: 'bgCard',
    borderRadius: "8px",
    boxShadow: "0 6px 8px 0px rgba(0,0,0,0.25)",
  },
})

export const cardTheme = defineMultiStyleConfig({ 
  variants: {custom} 
})
