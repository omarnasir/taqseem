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
    }
  }
})
