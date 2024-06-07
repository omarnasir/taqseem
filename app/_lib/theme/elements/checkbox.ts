import { checkboxAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(checkboxAnatomy.keys)

const transactionStrategy = definePartsStyle({
  control: {
    marginRight: 3,
    border: 'none',
    _checked: {
      bg: 'none',
      _hover: {
        bg: 'transparent',
      },
    },
  },
  container: {
    bg: 'whiteAlpha.200',
    justifyContent: 'flex-start',
    width: '100%',
    opacity: 0.8,
    _checked: {
      border: 'none',
      opacity: 1,
    }
  },
  label: {
    fontSize: 'md',
    fontWeight: 500,
    letterSpacing: 'tight',
    color: 'whiteAlpha.800',
    _checked: {
      color: 'black',
    }
  },
  icon: {
    fontSize: 'md',
  },
})

const transactionStrategyEveryone = definePartsStyle({
  ...transactionStrategy,
  container: {
    ...transactionStrategy.container,
    _checked: {
      ...transactionStrategy.container._checked,
      bg: 'whiteAlpha.700 !important',
    },
  },
  label: {
    ...transactionStrategy.label,
    _checked: {
      color: 'black',
    },
  }
})

const transactionStrategyThem = definePartsStyle({
  ...transactionStrategy,
  container: {
    ...transactionStrategy.container,
    _checked: {
      ...transactionStrategy.container._checked,
      bg: 'green.300 !important',
    },
  },
  label: {
    ...transactionStrategy.label,
    color: 'green.300',
    opacity: 0.8,
  }
})

const transactionStrategyYou = definePartsStyle({
  ...transactionStrategy,
  container: {
    ...transactionStrategy.container,
    _checked: {
      ...transactionStrategy.container._checked,
      bg: 'red.300 !important',
    },
  },
  label: {
    ...transactionStrategy.label,
    color: 'red.300',
  }
})

const transactionDetailsUser = definePartsStyle({
  label: {
    fontSize: 'sm',
    fontWeight: 300,
    paddingLeft: 2,
  },
  control: {
    boxSize: '1rem',
    _checked: {
      border: 'none',
      bg: 'whiteAlpha.800',
    },
    _focus: {
      boxShadow: 'none',
    },
  },
})

const settlement = definePartsStyle({
  container: {
    justifyContent: 'flex-start',
  },
  control: {
    boxSize: '1rem',
    bg: 'whiteAlpha.300',
    border: 'none',
    _checked: {
      bg: 'whiteAlpha.800',
      _hover: {
        bg: 'whiteAlpha.800',
    },
  },

  },
})


export const checkboxTheme = defineMultiStyleConfig({
  variants: {
    transactionStrategyYou, 
    transactionStrategyThem, 
    transactionStrategyEveryone,
    transactionDetailsUser,
    settlement
  }
})
