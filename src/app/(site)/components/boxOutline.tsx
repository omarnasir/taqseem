import {
  Box
} from '@chakra-ui/react'


export function BoxOutline({ children, ...props }
  : { children: React.ReactNode, [x: string]: any }
) {
  return (
    <Box
      width={'100%'}
      borderRadius="xl"
      borderWidth={1}
      paddingX={4}
      marginBottom={4}
      marginTop={2}
      {...props}
    >
      {children}
    </Box>
  )
}