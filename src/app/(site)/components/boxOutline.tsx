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
      bg={'itemSurface'}
      paddingY={4}
      paddingX={4}
      {...props}
    >
      {children}
    </Box>
  )
}