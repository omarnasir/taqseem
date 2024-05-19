import { inputAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys)

export const base = definePartsStyle({
  group: {
    borderBottom: "1px solid",
    borderBottomColor: "whiteAlpha.300",
    borderRadius: "0",
  },
  addon: {
    textColor: "whiteAlpha.700",
    letterSpacing: "tighter",
    fontWeight: 200,
    marginLeft: -2,
    fontSize: {
      base: "sm",
      md: "md",
    }
  },
  field: {
    paddingLeft: 2,
    borderRadius: "none",
    fontSize: {
      base: "md",
      md: "lg",
    },
    _invalid: {
      borderColor: "rgba(155, 25, 30, 1)",
      borderBottomWidth: "2px",
    },
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

const transactionNote = definePartsStyle({
  ...base,
  group: {
    ...base.group,
    border: "1px solid",
    borderWidth: "1px",
    borderColor: "whiteAlpha.300",
    borderRadius: "md",
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
    transactionNote,
    login,
  },
})
