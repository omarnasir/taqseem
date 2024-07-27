import { defineStyleConfig } from '@chakra-ui/react'


const activityTexts = defineStyleConfig({
  variants: {
    activityCreatedBy: {
      fontSize: 'md',
      color: 'whiteAlpha.900',
      letterSpacing: 'tight',
      fontWeight: '700'
    },
    activityDescription: {
      fontSize: 'sm',
      color: 'whiteAlpha.800',
    },
    activityUserStatus: {
      fontSize: 'xs',
      color: 'whiteAlpha.600',
      opacity: 0.8,
      fontWeight: 300,
    },
    activityLent: {
      fontSize: 'xs',
      color: 'green.300',
      opacity: 0.9,
      fontWeight: 300,
    },
    activityBorrowed: {
      fontSize: 'xs',
      color: 'red.300',
      opacity: 0.9,
      fontWeight: 300,
    },
  }
})


const settlementTexts = defineStyleConfig({
  variants: {
    settlementPayor: {
      fontWeight: 500,
      color: 'red.500',
    },
    settlementPayee: {
      color: 'green.500',
    },
    settlementCaption: {
      fontSize: 'xs',
      color: 'whiteAlpha.500',
      fontWeight: 500,
    },
  }
})

export const textTheme = defineStyleConfig({
  baseStyle: {
    fontWeight: 400,
    letterSpacing: 'normal',
    color: 'white'
  },
  variants: {
    ...settlementTexts.variants,
    ...activityTexts.variants,
    listPrimary: {
      textAlign: 'start',
      fontSize: 'lg',
      letterSpacing: 'normal',
      fontWeight: 500,
      color: 'white',
    },
    listSecondary: {
      fontSize: 'xs',
      color: 'whiteAlpha.800',
      fontWeight: 500,
    },
    listSupplementary: {
      fontSize: 'sm',
      opacity: 0.65,
      textAlign: 'end',
      color: 'whiteAlpha.800'
    },
    listAmount: {
      textAlign: 'end',
      fontSize: 'xl',
    },
    caption: {
      justifySelf: 'end',
      textAlign: 'right',
      fontSize: 'sm',
      color: 'whiteAlpha.700'
    },
    footer: {
      fontSize: { base: 'xs', md: 'sm' },
      mt: 2,
      display: { base: 'none', md: 'block' }
    }
  }
})
