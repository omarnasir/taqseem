import { inputAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys)

const baseStyle = definePartsStyle({
  field: {
    _focus: {
      borderColor: "gray.100",
    },
    color: "gray.100",
    _autofill: {
      boxShadow: "0 0 0px 1000px #0a0a0a inset",
      transition: "background-color 5000s ease-in-out 0s",
    },
  }
})

export const inputTheme = defineMultiStyleConfig({ baseStyle })
