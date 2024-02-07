import { numberInputAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(numberInputAnatomy.keys)

const custom = definePartsStyle({
  field: {
    _invalid: {
      borderColor: "rgba(155, 25, 30, 1)",
      borderBottomWidth: "2px",
    },
    paddingLeft: 0,
    background: "transparent",
    borderLeftRadius: "0px",
    _disabled: {
      background: "rgba(5,5,5, 1)",
    },
    _focus: {
      borderColor: "gray",
      borderBottomWidth: "1px",
    },
    _autofill: {
      transition: "background-color 5000s ease-in-out 0s",
    },
  }
})

export const numberTheme = defineMultiStyleConfig({ variants: { custom } })
