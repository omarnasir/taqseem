import { defineStyleConfig } from '@chakra-ui/react'

const buttonFontSizes = {
  fontSize: {
    base: 'md',
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
      bottom: 14,
      right: 3,
      alignSelf: 'flex-end',
      fontSize: '2xl',
      zIndex: 1,
      rounded: 'full',
      bg: 'whiteAlpha.800',
      color: 'black',
      _disabled: {
        bg: 'whiteAlpha.300',
        color: 'black',
      },

    },
    add: {
      _dark: {
        marginTop: 4,
        ...buttonFontSizes,
        borderColor: 'whiteAlpha.200',
        bg: 'whiteAlpha.800',
        color: 'black',
        _disabled: {
          bg: 'whiteAlpha.300',
          textColor: 'black',
        },
      }
    },
    update: {
      _dark: {
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
      borderWidth: 0.5,
      borderColor: 'red.200',
      color: 'red.200',
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
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
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
      bg: 'purple.200',
      color: 'black',
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
    fontWeight: '500',
    color: 'black',
  },
  sizes: {
    sm: {
      height: '2rem',
    },
    md: {
      height: '2.2rem',
    },
  },
  variants: {
    ...baseVariants.variants,
    settleGroup: {
      ...baseVariants.variants?.settle,
      fontSize: 'sm',
      height: '2.0rem',
      width: '30%',
      position: 'relative',
      top: '-4vh',
    },
    detailsUserEveryone: {
      ...buttonFontSizes,
      ...baseVariants.variants?.detailsUser,
      color: 'blackAlpha.900',
      width: '7rem',
      fontWeight: 900,
      bg: 'whiteAlpha.800',
    },
    detailsUserNone: {
      ...buttonFontSizes,
      ...baseVariants.variants?.detailsUser,
      color: 'whiteAlpha.800',
      width: '5rem',
      borderColor: 'whiteAlpha.300',
      borderWidth: 1,
    },
  }
})
