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
    bg: 'bgCard',
    borderRadius: "lg",
    boxShadow: "0 2px 14px rgba(20, 19, 25, 0.5)",
  },
  body: {
    paddingTop: 0,
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

const summaryStat = definePartsStyle({
  container: {
    bg: 'bgCard',
    borderRadius: "lg",
    boxShadow: "0 2px 14px rgba(20, 19, 25, 0.5)",
  },
  body: {
    paddingBottom: 2,
  },
  footer: {
    paddingTop: 0,
    justifyContent: 'flex-end',
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

const settlementCard = definePartsStyle({
  container: {
    bg: 'bgCard',
    borderRadius: "lg",
    boxShadow: "0 2px 14px rgba(20, 19, 25, 0.5)",
  },
  header : {
    justifyContent: 'space-between',
  }
})

export const cardTheme = defineMultiStyleConfig({
  variants: {
    loginCard,
    infoCard,
    createCard,
    summaryStat,
    settlementCard,
  },
})
