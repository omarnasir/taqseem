import { cardAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(cardAnatomy.keys)

const infoCard = definePartsStyle({
  header: {
    paddingX: 4,
    paddingTop: 4,
    letterSpacing: 'normal',
  },
  container: {
    bg: 'itemSurface',
    borderRadius: "lg",
    boxShadow: "0 2px 14px rgba(20, 19, 25, 0.5)",
  },
  body: {
    paddingTop: 4,
    alignSelf: 'flex-end',
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


const loginCard = definePartsStyle({
  ...createCard,
  container: {
    bg: 'whiteAlpha.100',
    borderRadius: "lg",
    boxShadow: "0 2px 14px rgba(20, 19, 25, 0.5)",
  },
})


export const cardTheme = defineMultiStyleConfig({
  variants: {
    loginCard,
    infoCard,
    createCard,
  },
})
