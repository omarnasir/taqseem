import { inputAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys)

export const base = definePartsStyle({
  group: {
    borderRadius: 6,
    bg: "whiteAlpha.200",
  },
  addon: {
    textColor: "whiteAlpha.600",
    letterSpacing: "wide",
    fontWeight: 300,
    fontSize: ["md" , "lg"],
  },
  field: {
    borderRadius: "none",
    fontSize: ["md", "lg"],
    _invalid: {
      borderColor: "rgba(155, 25, 30, 1)",
      borderBottomWidth: "2px",
    },
    background: "transparent",

    _autofill: {
      transition: "background-color 5000s ease-in-out 0s",
    },
  }
})


const transactionStrategy = definePartsStyle({
  ...base,
  group: {
    border: "none",
  },
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
    transaction: base,
    transactionStrategy,
    login,
  },
})
