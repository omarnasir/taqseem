import { defineStyleConfig } from '@chakra-ui/react'

const login = {
    marginBottom: 1,
    fontSize: 'sm',
    fontWeight: 'light'
}

const transaction = {
  marginBottom: 2,
  fontWeight: 300,
  letterSpacing: 'normal',
  fontSize: 'xs',
}

export const formLabelTheme = defineStyleConfig({
  variants: {
    login,
    transaction
  }
})
