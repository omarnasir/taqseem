import { accordionAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(accordionAnatomy.keys)

const transaction = definePartsStyle({
  root: {
    borderRadius: 'lg',
    borderWidth: '1px',
    borderColor: 'whiteAlpha.300',

  },
  container: {
    border: 'none',
  },
  panel: {
    marginTop: 3,
  },
  button: {
    width: '100%',
    _expanded: {
      bg: 'whiteAlpha.300',
      fontWeight: 'bold',
    },
    height: '3rem',
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
