import { defineStyleConfig } from '@chakra-ui/react'

const login = {
    marginBottom: 1,
    fontSize: ['sm', 'md'],
    fontWeight: 'light'
}

const transaction = {
  marginBottom: 2,
  fontWeight: 300,
  letterSpacing: 'normal',
  fontSize: ['md', 'lg'],
}

export const formLabelTheme = defineStyleConfig({
  baseStyle: {
    fontSize: ['md', 'xl'],
  },
  variants: {
    login,
    transaction
  }
})
