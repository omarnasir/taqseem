import { defineStyleConfig } from '@chakra-ui/react'

export const buttonTheme = defineStyleConfig({
  variants: {
    login: {
      bg: 'whiteAlpha.800',
      colorScheme: 'loginbtn',
      textColor: 'black',
      fontWeight: 'medium',
      _hover: {
        bg: '#aaaaaa',
        textColor: 'black',
      },
    },
    add: {
      borderColor: 'whiteAlpha.200',
      borderWidth: '0.05rem',
      bg: 'whiteAlpha.800',
      color: 'black',
      fontWeight: 500,
      boxShadow: '0 2px 10px 0 rgba(0,0,0,0.5)',
      _disabled: {
        bg: 'whiteAlpha.300',
        textColor: 'black',
      },
    },
    update: {
      bg: 'orange.300',
      borderRadius: 'sm',
      color: 'black',
      opacity: 0.80,
      fontWeight: 500,
      boxShadow: '0 2px 10px 0 rgba(0,0,0,0.5)',
    },
    delete: {
      borderColor: 'red.300',
      borderWidth: 1,
      color: 'red.300',
      opacity: 0.80,
      fontWeight: 500,
      boxShadow: '0 2px 10px 0 rgba(0,0,0,0.5)',
      fontSize: {
        base: 'xs',
        md: 'sm',
      },
      height: {
        base: '2rem',
        md: '2.5rem',
      }
    },
    headerButton: {
      fontSize: 'lg',
      color: 'whiteAlpha.700',
      bg: 'transparent',
    },
    previous: {
      bg: 'rgb(50,50,50)',
    },
    action: {
      borderColor: 'teal.300',
      borderWidth: 1,
      color: 'teal.300',
      opacity: 0.80,
      fontWeight: 500,
      boxShadow: '0 2px 10px 0 rgba(0,0,0,0.5)',
      fontSize: {
        base: 'xs',
        md: 'sm',
      },
      height: {
        base: '2rem',
        md: '2.5rem',
      },
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
