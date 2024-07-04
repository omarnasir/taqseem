import { tabsAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tabsAnatomy.keys)

const transaction = definePartsStyle({
  root: {
  },
  tab: {
    borderTopRadius: 'md',
    fontWeight: '400',
    fontSize: 'sm',
    bg: 'whiteAlpha.100',
    letterSpacing: 'wide',
    _selected: {
      bg: 'purple.700',
    }
  },
  tablist: {
    marginX: 4,
    borderBottom: '1px solid',
    borderColor: 'purple.700',
  },
})

export const tabTheme = defineMultiStyleConfig({
  variants: {
    transaction
  }
})

