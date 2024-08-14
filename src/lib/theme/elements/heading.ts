import { defineStyleConfig } from '@chakra-ui/react'

export const headingTheme = defineStyleConfig({
  sizes: {
    h1: {
      fontSize: ['2xl', '4xl'],
      fontWeight: 500,
    },
    h1Center: {
      fontSize: ['2xl', '4xl'],
      alignSelf: 'center',
      textAlign: 'center',
      position:'sticky',
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
    h5: {
      fontSize: ['sm', 'md'],
      fontWeight: 500,
    },
  }
})
