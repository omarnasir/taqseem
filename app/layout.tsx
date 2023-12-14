import './globals.css';
import {
  ChakraProvider,
  ColorModeScript,
  extendTheme,
  type ThemeConfig
}
  from "@chakra-ui/react"
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { auth } from '@/auth';

import { SessionProvider } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Taqseem',
};

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}
const theme = extendTheme({ config })

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          <ChakraProvider>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            {children}
          </ChakraProvider>
        </SessionProvider>
      </body>
    </html>
  );
}