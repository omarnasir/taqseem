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
    paddingLeft: base.field.paddingLeft,
    background: base.field.background,
    fontSize: base.field.fontSize,
  }
})

export const selectTheme = defineMultiStyleConfig({ variants: { transaction } })
