import { base } from './input'

import { selectAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(selectAnatomy.keys)

const transaction = definePartsStyle({
  field: {
    marginLeft: 6,
    background: base.field.background,
    fontSize: base.field.fontSize,
    _disabled: {
      color: 'whiteAlpha.400',
    },
  },
  icon: {
    _disabled: {
      color: 'whiteAlpha.400',
    },
  },
})

const settlement = definePartsStyle({
  field: {
    height: 8,
    marginY: 2,
    background: 'blackAlpha.400',
  }
})

export const selectTheme = defineMultiStyleConfig({ variants: { transaction , settlement} })
