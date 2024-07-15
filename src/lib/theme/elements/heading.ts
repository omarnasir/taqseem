import { defineStyleConfig } from '@chakra-ui/react'

export const headingTheme = defineStyleConfig({
  variants: {
    h1: {
      fontSize: '3xl',
      fontWeight: 500,
    },
    h1Center: {
      fontSize: 'xl',
      alignSelf: 'center',
      textAlign: 'center',
      zIndex:'1',
      position:'sticky',
      top:'-6vh',
    },
    h2: {
      fontSize: 'xl',
      fontWeight: 500,
      letterSpacing: 'tight',
    },
    h3: {
      fontSize: 'md',
      fontWeight: 500,
      letterSpacing: 'tight',
    },
    h4: {
      fontSize: 'sm',
      fontWeight: 500,
      letterSpacing: 'tight',
    },
  }
})
