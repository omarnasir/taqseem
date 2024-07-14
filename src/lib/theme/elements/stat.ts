import { statAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(statAnatomy.keys)

const baseStyle = definePartsStyle({
  container: {
    padding: 2,
    borderRadius: "xl",
    boxShadow: "none",
  },
  label: {
    padding: 1,
    color: "white",
    fontWeight: "300",
  },
  number: {
    padding: 1,
    fontWeight: "600",
    letterSpacing: "tight",
  },
  helpText: {
    padding: 1,
    fontWeight: "300",
  },
})

const primary = definePartsStyle({
  label: {
    fontSize: "lg",
  },
  number: {
    fontSize: "4xl",
  }
})

const secondary = definePartsStyle({
  container: {
    textAlign: "center",
    padding: 0,
  },
  label: {
    padding: 0,
    fontSize: "sm",
  },
  number: {
    paddingBottom: 1,
    paddingX: 0,
    fontSize: "xl",
    fontWeight: "500",
  },
  helpText: {
    padding: 0,
    fontSize: "2xs",
    fontWeight: "300",
  },

})

export const statTheme = defineMultiStyleConfig({
  baseStyle,
  variants: {
    primary,
    secondary,
  },
})
