import { selectAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(selectAnatomy.keys)

const custom = definePartsStyle({
  group: {
    background: "rgba(60, 60, 60, 0.25)",
    borderRadius: "8px",
    boxShadow: "0 6px 8px 0px rgba(0,0,0,0.25)",
  },
  field: {
    paddingLeft: 2,
    background: "transparent",
    fontSize: {
      base: "md",
      md: "lg",
    },
  }
})

export const selectTheme = defineMultiStyleConfig({ variants: { custom } })
