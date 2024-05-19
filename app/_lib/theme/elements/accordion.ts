import { accordionAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(accordionAnatomy.keys)

const transaction = definePartsStyle({
  root: {
    borderRadius: 'lg',
    border: '1px solid',
    borderColor: 'whiteAlpha.300',
    marginTop: 2,
  },
  container: {
    border: 'none',
  },
  panel: {
    marginTop: 3,
  },
  button: {
    width: '100%',
    fontSize: 'sm',
    borderTopRadius: 'lg',
    _expanded: {
      borderTopRadius: 'none',
      bg: 'whiteAlpha.100',
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
