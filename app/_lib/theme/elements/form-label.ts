import { defineStyleConfig } from '@chakra-ui/react'

const login = {
    marginBottom: 1,
    fontSize: 'sm',
    fontWeight: 'light'
}

const transaction = {
  fontWeight: 'light',
  letterSpacing: 'tight',
  fontSize: 'sm',
  width: '5.5rem',
  alignSelf: 'center',
}

export const formLabelTheme = defineStyleConfig({
  variants: {
    login,
    transaction
  }
})
