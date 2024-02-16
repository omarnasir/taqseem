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
      bg: 'whiteAlpha.800',
      boxShadow: '0px 4px 6px 4px rgba(0, 0, 0, 0.1)',
      textColor: 'black',
      _disabled: {
        bg: 'whiteAlpha.300',
        textColor: 'black',
      },
    },
    delete: {
      bg: 'red.400',
      opacity: 0.75,
      color: 'black',
      fontWeight: 'medium',
    },
    headerButton: {
      fontSize: 'lg',
      color: 'whiteAlpha.700',
    },
    previous: {
      bg: 'rgb(50,50,50)',
    }
  }
})
