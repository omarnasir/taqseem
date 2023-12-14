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

import { SessionProvider } from '@/app/utils/AuthProvider';
import { getServerSession } from 'next-auth';

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
  // const session = await auth();
  const session = await getServerSession();

  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <ChakraProvider>
            {/* <ColorModeScript initialColorMode={theme.config.initialColorMode} /> */}
            {children}
          </ChakraProvider>
        </SessionProvider>
      </body>
    </html>
  );
}