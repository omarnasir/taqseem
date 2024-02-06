import { checkboxAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(checkboxAnatomy.keys)

const transactionEveryone = definePartsStyle({
  control: {
    border: 'none',
  },
  label: {
    fontSize: 'sm',
    fontWeight: 'medium',
  },
})

export const checkboxTheme = defineMultiStyleConfig({ variants: {transactionEveryone} })
