import { statAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(statAnatomy.keys)

const baseStyle = definePartsStyle({
  container: {
    padding: 2,
    borderRadius: "xl",
    boxShadow: "0 2px 14px rgba(20, 19, 25, 0.5)",
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
    fontWeight: "200",
  },
})

const primary = definePartsStyle({
  container: {
    ...baseStyle.container,
    boxShadow: 'none',
  },
  number: {
    fontSize: "4xl",
  }
})

const secondary = definePartsStyle({
  container: {
    bg: 'bgCard'
  },
  label: {
    fontSize: "md",
  },
  number: {
    fontSize: "2xl",
  },
  helpText: {
    fontSize: "xs",
  },
  
})

export const statTheme = defineMultiStyleConfig({
  baseStyle,
  variants: {
    primary,
    secondary,
  },
})
