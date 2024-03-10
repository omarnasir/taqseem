import { base } from './input'

import { numberInputAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(numberInputAnatomy.keys)

const transaction = definePartsStyle({
  field: {
    ...base.field,
    _disabled: {
      background: "rgba(5,5,5, 1)",
    },
  }
})

export const numberTheme = defineMultiStyleConfig({ variants: { transaction } })
