import { base } from './input'

import { selectAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(selectAnatomy.keys)

const transaction = definePartsStyle({
  group: {
    background: "rgba(60, 60, 60, 0.25)",
    borderRadius: "8px",
    boxShadow: "0 6px 8px 0px rgba(0,0,0,0.25)",
  },
  field: {
    marginLeft: 6,
    background: base.field.background,
    fontSize: base.field.fontSize,
  }
})

const settlement = definePartsStyle({
  group: {
    background: "rgba(60, 60, 60, 0.25)",
    borderRadius: "8px",
    boxShadow: "0 6px 8px 0px rgba(0,0,0,0.25)",
  },
  field: {
    height: 8,
    marginY: 2,
    background: 'blackAlpha.400',
  }
})

export const selectTheme = defineMultiStyleConfig({ variants: { transaction , settlement} })
