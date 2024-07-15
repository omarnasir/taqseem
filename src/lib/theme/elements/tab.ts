import { tabsAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tabsAnatomy.keys)

const transaction = definePartsStyle({
  root: {
  },
  tab: {
    borderTopRadius: 'md',
    fontWeight: 500,
    color: 'whiteAlpha.600',
    fontSize: 'sm',
    bg: 'whiteAlpha.100',
    letterSpacing: 'wide',
    _selected: {
      fontWeight: 900,
      color: 'black',
      bg: 'whiteAlpha.700',
    }
  },
  tablist: {
    marginX: 4,
    borderBottomWidth: 1,
    borderColor: 'whiteAlpha.300',
  },
})

export const tabTheme = defineMultiStyleConfig({
  variants: {
    transaction
  }
})

