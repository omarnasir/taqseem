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
      colorScheme: 'loginbtn',
      textColor: 'black'
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
