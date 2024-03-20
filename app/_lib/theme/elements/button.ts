import { defineStyleConfig } from '@chakra-ui/react'

export const buttonTheme = defineStyleConfig({
  sizes: {
    sm: {
      fontSize: 'xs',
      height: '2rem',
    },
    md: {
      fontSize: 'sm',
      height: '2.5rem',
    },
  },
  baseStyle: {
    borderRadius: 'md',
    fontWeight: 'medium',
    color: 'black',
    boxShadow: '0 2px 10px 0 rgba(0,0,0,0.5)',
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
      borderColor: 'whiteAlpha.200',
      bg: 'gray.300',
      _disabled: {
        bg: 'whiteAlpha.300',
        textColor: 'black',
      },
    },
    update: {
      bg: 'orange.300',
      opacity: 0.80,
    },
    delete: {
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
    action: {
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
