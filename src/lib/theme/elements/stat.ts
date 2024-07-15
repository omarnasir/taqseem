import { statAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(statAnatomy.keys)

const baseStyle = definePartsStyle({
  number: {
    marginRight: 2,
    textAlign: "right",
    fontWeight: "500",
    letterSpacing: "tight",
  },
  helpText: {
    fontSize: "2xs",
    marginRight: 2,
    textAlign: "right",
    fontWeight: "300",
  },
})

const primary = definePartsStyle({
  container: {
    marginTop: 4,
  },
  number: {
    fontSize: "3xl",
    textAlign: "left",
  },
  helpText: {
    textAlign: "left",
    fontSize: "2xs",
  }
})

const secondary = definePartsStyle({
  container: {
    textAlign: "center",
    marginTop: 1,
  },
  number: {
    fontSize: "2xl",
    fontWeight: "500",
  },
  helpText: {
    fontSize: "2xs",
  }
})

export const statTheme = defineMultiStyleConfig({
  baseStyle,
  variants: {
    primary,
    secondary,
  },
})
