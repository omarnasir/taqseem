'use client'
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react"
import customTheme from "../themeConfig";


export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <CacheProvider>
      <ColorModeScript initialColorMode={customTheme.config.initialColorMode} />
      <ChakraProvider theme={customTheme}>
        {children}
      </ChakraProvider>
    </CacheProvider>
  )
}