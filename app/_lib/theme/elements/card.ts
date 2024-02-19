import { cardAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(cardAnatomy.keys)

const infoCard = definePartsStyle({
  container: {
    borderRadius: "8px",
    boxShadow: "0 2px 14px rgba(20, 19, 25, 0.5)",
  },
})

export const cardTheme = defineMultiStyleConfig({ 
  variants: { 
    infoCard 
  },
  baseStyle: {
    container: {
      bg: 'bgCard',
    }
  }
})
