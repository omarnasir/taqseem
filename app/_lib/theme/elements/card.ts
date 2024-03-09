import { cardAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(cardAnatomy.keys)

const infoCard = definePartsStyle({
  container: {
    bg: 'transparent',
    borderRadius: "8px",
    boxShadow: "0 2px 14px rgba(20, 19, 25, 0.5)",
  },
  body: {
    paddingY: 2,
    direction: 'column',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
})

const createCard = definePartsStyle({
  container: {
    bg: 'transparent',
    borderRadius: "8px",
    boxShadow: "0 2px 14px rgba(20, 19, 25, 0.5)",
  },
  body: {
    paddingY: 4,
    direction: 'column',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export const cardTheme = defineMultiStyleConfig({
  variants: {
    infoCard,
    createCard
  },
})
