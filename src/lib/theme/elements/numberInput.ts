import { base } from './input'

import { numberInputAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(numberInputAnatomy.keys)

const transaction = definePartsStyle({
  field: {
    ...base.field,
    color: 'whiteAlpha.800',
    marginLeft: -4,
    _disabled: {
      background: "rgba(5,5,5, 1)",
    },
  }
})

const settlement = definePartsStyle({
  field: {
    textAlign: 'start',
    fontSize: 'sm',
    background: 'blackAlpha.400',
    _disabled: {
      background: "rgba(5,5,5, 1)",
    },
  }
})

export const numberTheme = defineMultiStyleConfig({ variants: { transaction, settlement } })
