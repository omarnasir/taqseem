import { defineStyleConfig } from '@chakra-ui/react'

export const headingTheme = defineStyleConfig({
  sizes: {
    h1: {
      fontSize: ['2xl', '4xl'],
      fontWeight: 500,
    },
    h1Center: {
      fontSize: ['xl', '3xl'],
      alignSelf: 'center',
      textAlign: 'center',
      zIndex:'1',
      position:'sticky',
      top:'-6vh',
    },
    h2: {
      fontSize: ['xl', '2xl'],
      fontWeight: 500,
    },
    h3: {
      fontSize: ['lg', 'xl'],
      fontWeight: 500,
    },
    h4: {
      fontSize: ['md', 'lg'],
      fontWeight: 500,
    },
  }
})
