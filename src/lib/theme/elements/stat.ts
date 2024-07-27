import { statAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(statAnatomy.keys)

const baseStyle = definePartsStyle({
  number: {
    marginRight: 2,
    textAlign: "right",
    fontWeight: "400",
  },
  helpText: {
    fontSize: "xs",
    marginRight: 2,
    textAlign: "right",
  },
})

const primary = definePartsStyle({
  container: {
    marginTop: 0,
  },
  number: {
    fontSize: "5xl",
    textAlign: "left",
  },
  helpText: {
    textAlign: "left",
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
    fontSize: "sm",
  }
})

export const statTheme = defineMultiStyleConfig({
  baseStyle,
  variants: {
    primary,
    secondary,
  },
})
