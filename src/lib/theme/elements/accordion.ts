import { accordionAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(accordionAnatomy.keys)

const transaction = definePartsStyle({
  root: {
    marginTop: 4,
  },
  container: {
    border: 'none',
  },
  panel: {
    marginTop: 3,
  },
  button: {
    fontWeight: "300 !important",
    letterSpacing: "wide",
    width: '100%',
    fontSize: 'sm',
    borderTopRadius: 'lg',
    _expanded: {
      borderTopRadius: 'none',
      bg: 'whiteAlpha.200',
      fontWeight: '500',
    },
    height: '2.5rem',
    justifyContent: 'space-between',
  },
  icon: {
    color: 'gray.500',
  },
})

export const accordionTheme = defineMultiStyleConfig({
  variants: {
    transaction,
  },
})
