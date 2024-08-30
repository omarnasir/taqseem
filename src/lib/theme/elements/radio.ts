import { radioAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(radioAnatomy.keys)

const transactionStrategy = definePartsStyle({
  control: {
    boxSize: 6,
    marginRight: 3,
    opacity: 1.0,
    _focusVisible: {
      boxShadow: 'none',
    },
  },
  container: {
    justifyContent: 'flex-start',
    rounded: 'lg',
    width: '100%',
    padding: 2,
    opacity: 0.75,
    _checked: {
      border: '2px solid',
      opacity: 1
    }
  },
  label: {
    fontSize: 'md',
    fontWeight: 300,
    letterSpacing: 'tight',
    _checked: {
      letterSpacing: 'wide',
      fontWeight: 500,
    },
  },
})

const transactionStrategyEveryone = definePartsStyle({
  ...transactionStrategy,
  control: {
    ...transactionStrategy.control,
    _checked: {
      bg: 'whiteAlpha.900',
      borderColor: 'whiteAlpha.700',
    },
  },
  container: {
    ...transactionStrategy.container,
    _checked: {
      ...transactionStrategy.container._checked,
      borderColor: 'whiteAlpha.700 !important',
    },
  },
  label: {
    ...transactionStrategy.label,
    color: 'whiteAlpha.800',
  }
})

const transactionStrategyThem = definePartsStyle({
  ...transactionStrategy,
  control: {
    ...transactionStrategy.control,
    _checked: {
      bg: 'green.300',
      borderColor: 'green.300',
    },
  },
  container: {
    ...transactionStrategy.container,
    _checked: {
      ...transactionStrategy.container._checked,
      borderColor: 'green.300 !important',
    },
  },
  label: {
    ...transactionStrategy.label,
    color: 'green.300',
  }
})

const transactionStrategyYou = definePartsStyle({
  ...transactionStrategy,
  control: {
    ...transactionStrategy.control,
    _checked: {
      bg: 'red.300',
      borderColor: 'red.300',
    },
  },
  container: {
    ...transactionStrategy.container,
    _checked: {
      ...transactionStrategy.container._checked,
      borderColor: 'red.300 !important',
    },
  },
  label: {
    ...transactionStrategy.label,
    color: 'red.300',
  }
})

const transactionDetailsUser = definePartsStyle({
  control: {
    _checked: {
      border: 'none',
      bg: 'whiteAlpha.800',
    },
    _focus: {
      boxShadow: 'none',
    },
  },
})

export const radioTheme = defineMultiStyleConfig({
  variants: {
    transactionStrategyYou, 
    transactionStrategyThem, 
    transactionStrategyEveryone,
    transactionDetailsUser
  }
})
