import { defineStyleConfig } from '@chakra-ui/react'

const buttonFontSizes = {
  fontSize: {
    base: 'sm',
    '2xl': 'md',
  }
}

const baseVariants = defineStyleConfig({
  variants: {
  login: {
    bg: 'whiteAlpha.800',
    colorScheme: 'loginbtn',
    _hover: {
      bg: '#aaaaaa',
      textColor: 'black',
    },
  },
  new: {
    position: 'fixed',
    alignSelf: 'flex-end',
    zIndex: 10,
    rounded: 'full',
    bottom: '10vh',
    bg: 'gray.300',
    _disabled: {
      bg: 'whiteAlpha.300',
      textColor: 'black',
    },

  },
  add: {
    _dark:{
      ...buttonFontSizes,
      borderColor: 'whiteAlpha.200',
      bg: 'gray.300',
      _disabled: {
        bg: 'whiteAlpha.400',
        textColor: 'black',
      },
    }
  },
  update: {
    _dark:{
      ...buttonFontSizes,
      bg: 'orange.300',
      opacity: 0.80,
      _disabled: {
        opacity: 0.30,
        textColor: 'black',
      },
    }
  },
  delete: {
    ...buttonFontSizes,
    borderWidth: 1,
    borderColor: 'red.300',
    color: 'red.300',
  },
  deleteBin: {
    ...buttonFontSizes,
    color: 'red.300',
    boxShadow: 'none'
  },
  headerButton: {
    fontSize: 'lg',
    color: 'whiteAlpha.800',
    bg: 'transparent',
    boxShadow: 'none',
  },
  footer: {
    color: 'whiteAlpha.800',
    borderRadius: '0',
  },
  previous: {
    bg: 'rgb(50,50,50)',
  },
  loadMore: {
    ...buttonFontSizes,
    marginTop: '1rem',
    border: '1px solid',
    borderColor: 'whiteAlpha.700',
    color: 'whiteAlpha.700',
    width: '40%',
    alignSelf: 'center',
    _disabled: {
      border: 'none',
      bgColor: 'whiteAlpha.200 !important',
      color: 'whiteAlpha.700',
    },
  },
  action: {
    ...buttonFontSizes,
    borderWidth: 1,
    borderColor: 'blue.300',
    color: 'blue.200',
    fontWeight: 500,
  },
  formNavigation: {
    ...buttonFontSizes,
    bg: 'whiteAlpha.700',
    color: 'black',
    _hover: {
      _disabled: {
      bg: 'whiteAlpha.200',
      color: 'whiteAlpha.300',
      },
    },
    _disabled: {
      bg: 'whiteAlpha.200',
      color: 'whiteAlpha.300',
    },
  },
  settle: {
    ...buttonFontSizes,
    bg: 'whiteAlpha.800',
    color: 'black',
    fontWeight: 500,
    alignSelf: 'flex-end',
    _hover: {
      bg: 'whiteAlpha.700',
    },
    _disabled: {
      bg: 'whiteAlpha.200',
      color: 'whiteAlpha.600',
    },
  },
  detailsUser: {
    ...buttonFontSizes,
    fontSize: 'sm',
    fontWeight: 500,
    opacity: 0.8,
  }
}
})

export const buttonTheme = defineStyleConfig({
  baseStyle: {
    borderRadius: 'md',
    fontWeight: 'medium',
    color: 'black',
  },
  sizes: {
    sm: {
      height: '2rem',
    },
    md: {
      height: '2rem',
    },
  },
  variants: {
    ...baseVariants.variants,
    settleGroup: {
      ...baseVariants.variants?.settle,
      fontSize: 'sm',
      fontWeight: 500,
      height: '1.8rem',
      width: '30%',
      position: 'relative',
      top: '-4vh',
    },
    settleDashboard: {
      ...baseVariants.variants?.settle,
      fontSize: 'xs',
      alignSelf: 'flex-end',
      borderColor: 'whiteAlpha.600',
      borderWidth: 0.5,
      color: 'whiteAlpha.800',
      bg: 'transparent',
    },
    detailsUserEveryone: {
      ...buttonFontSizes,
      ...baseVariants.variants?.detailsUser,
      color: 'blackAlpha.900',
      width: '7rem',
      bg: 'pink.300',
    },
    detailsUserNone: {
      ...buttonFontSizes,
      ...baseVariants.variants?.detailsUser,
      color: 'whiteAlpha.800',
      width: '5rem',
      borderColor: 'pink.300',
      borderWidth: 1,
    },
  }
})
