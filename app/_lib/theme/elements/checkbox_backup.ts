import { checkboxAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(checkboxAnatomy.keys)

const transactionStrategy = definePartsStyle({
  control: {
    _checked: {
      bg: 'none',
      opacity: 0.8,
      _hover: {
        bg: 'transparent',
      },
    },
    height: '2rem',
    borderRadius: 'md',
    borderWidth: '1px',
    width: '2rem',
    alignSelf: 'center',
    marginRight: 3,
  },
  container: {
    paddingX: 0,
    bg: 'transparent !important',
    justifyContent: 'flex-start',
    width: '100%',
    fontWeight: 400,
  },
  label: {
    fontSize: 'md',
  },
  icon: {
    fontSize: 'md',
  },
})

const transactionStrategyEveryone = definePartsStyle({
  ...transactionStrategy,
  control: {
    ...transactionStrategy.control,
    _checked: {
      ...transactionStrategy.control._checked,
      border: 'none',
      bg: 'whiteAlpha.800 !important',
    },
  },
  label: {
    color: 'whiteAlpha.800',
  }
})

const transactionStrategyThem = definePartsStyle({
  ...transactionStrategy,
  control: {
    ...transactionStrategy.control,
    _checked: {
      ...transactionStrategy.control._checked,
      border: 'none',
      bg: 'green.400 !important',
      opacity: 0.8,
    },
  },
  label: {
    color: 'green.300',
  }
})

const transactionStrategyYou = definePartsStyle({
  ...transactionStrategy,
  control: {
    ...transactionStrategy.control,
    borderColor: 'red.400 !important',
    opacity: 0.8,
    borderWidth: '1px',
    _checked: {
      ...transactionStrategy.control._checked,
      border: 'none',
      bg: 'red.400 !important',
    },
  },
  label: {
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

export const checkboxTheme = defineMultiStyleConfig({
  variants: {
    transactionStrategyYou, 
    transactionStrategyThem, 
    transactionStrategyEveryone,
    transactionDetailsUser
  }
})
