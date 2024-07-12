import { defineStyleConfig } from '@chakra-ui/react'

export const textTheme = defineStyleConfig({
  variants: {
    listHeading: {
      fontSize: 'xl',
      alignSelf:'center',
      fontWeight:'300',
      textAlign:'center',
      zIndex:'1',
      position:'sticky',
      top:'-6vh',
    },
    pageHeading: {
      fontSize: '2xl',
      fontWeight: 300,
      letterSpacing: 'normal'
    },
    pageSubHeading: {
      fontSize: 'md',
      fontWeight: 200,
      letterSpacing: 'normal'
    },
    caption: {
      justifySelf: 'end',
      textAlign: 'right',
      fontSize: '2xs',
      color: 'whiteAlpha.600'
    }
  }
})
