import { statAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(statAnatomy.keys)

const baseStyle = definePartsStyle({
  number: {
    textAlign: "right",
    fontWeight: "400",
  },
  helpText: {
    fontSize: "xs",
    textAlign: "right",
    color: "whiteAlpha.800",
  },
})

const primary = definePartsStyle({
  number: {
    fontSize: ["5xl", "6xl"],
    textAlign: "left",
    fontFamily: "montserrat",
  },
  helpText: {
    marginTop: -2,
    marginBottom: 6,
    textAlign: "left",
    fontSize: ["md", "lg"],
  }
})

const secondary = definePartsStyle({
  container: {
    textAlign: "center",
  },
  number: {
    fontFamily: "montserrat",
    fontSize: ["2xl", "3xl"],
    fontWeight: "500",
  },
  helpText: {
    fontSize: ["sm", "md"],
  }
})

export const statTheme = defineMultiStyleConfig({
  baseStyle,
  variants: {
    primary,
    secondary,
  },
})
