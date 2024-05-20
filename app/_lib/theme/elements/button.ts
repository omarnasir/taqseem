import { defineStyleConfig } from '@chakra-ui/react'

const buttonFontSizes = {
  fontSize: {
    base: 'xs',
    '2xl': 'md',
  }
}

export const buttonTheme = defineStyleConfig({
  baseStyle: {
    borderRadius: 'md',
    fontWeight: 'medium',
    color: 'black',
    boxShadow: '0 2px 10px 0 rgba(0,0,0,0.5)'
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
      ...buttonFontSizes,
      borderColor: 'whiteAlpha.200',
      bg: 'gray.300',
      _disabled: {
        bg: 'whiteAlpha.300',
        textColor: 'black',
      },
    },
    update: {
      ...buttonFontSizes,
      bg: 'orange.300',
      opacity: 0.80,
    },
    delete: {
      ...buttonFontSizes,
      borderColor: 'red.300',
      color: 'red.300',
      opacity: 0.80,
      borderWidth: '0.05rem',
    },
    headerButton: {
      fontSize: 'lg',
      color: 'whiteAlpha.700',
      bg: 'transparent',
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
      borderColor: 'teal.300',
      color: 'teal.300',
      opacity: 0.80,
      borderWidth: '0.05rem',
    },
    formNavigation: {
      color: 'whiteAlpha.800',
      opacity: 0.80,
      fontWeight: 500,
      _disabled: {
        color: 'whiteAlpha.300',
      },
      fontSize: '2rem',
    }
  }
})
