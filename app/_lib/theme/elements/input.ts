import { inputAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys)

const custom = definePartsStyle({
  group: {
    background: "rgba(80, 80, 80, 0.25)",
    borderRadius: "8px",
  },
  field: {
    _invalid: {
      borderColor: "rgba(155, 25, 30, 1)",
      borderBottomWidth: "2px",
    },
    paddingLeft: 0,
    background: "transparent",
    _focus: {
      borderColor: "gray",
      borderBottomWidth: "1px",
    },
    _autofill: {
      transition: "background-color 5000s ease-in-out 0s",
    },
  }
})

const login = definePartsStyle({
  field: {
    _invalid: {
      borderColor: "rgba(155, 25, 30, 1)",
      borderBottomWidth: "2px",
    },
    fontSize: "sm",
    marginTop: "2",
    borderWidth: "1px",
    background: "transparent",
    borderColor: "rgba(155, 155, 155, 0.5)",
    _autofill: {
      transition: "background-color 5000s ease-in-out 0s",
    },
  },
})

export const inputTheme = defineMultiStyleConfig({
  variants: {
    custom,
    login,
  },
})
