import { checkboxAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(checkboxAnatomy.keys)

const transactionEveryone = definePartsStyle({
  control: {
    border: 'none',
    _checked: {
      bg: 'transparent',
    },
  },
  container: {
    _checked: {
      bg: 'whiteAlpha.800',
    },
    bg: 'whiteAlpha.300',
    color: 'gray.900',
  },
  label: {
    fontSize: 'sm',
    fontWeight: 'medium',
  },
})

const transactionDetailsUser = definePartsStyle({
  control: {
    _checked: {
      border: 'none',
      bg: 'whiteAlpha.800',
    },
    _focus: {
      boxShadow: 'none',
    },
  },
})

export const checkboxTheme = defineMultiStyleConfig({ variants: { transactionEveryone, transactionDetailsUser } })
