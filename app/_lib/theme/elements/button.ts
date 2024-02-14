import { defineStyleConfig } from '@chakra-ui/react'

export const buttonTheme = defineStyleConfig({
  variants: {
    solid: {
      bg: 'white',
      colorScheme: 'loginbtn',
      textColor: 'black',
      fontWeight: 'medium',
      _hover: {
        bg: '#aaaaaa',
        textColor: 'black',
      },
    },
    add: {
      bg: 'green.500',
      boxShadow: '0px 4px 6px 4px rgba(0, 0, 0, 0.1)',
      colorScheme: 'loginbtn',
      textColor: 'black'
    }
  }
})
