import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google'

import ChakraProvider from '@/app/_lib/providers/ChakraProvider';
import { AuthProvider } from '@/app/_lib/providers/AuthProvider';
import { ReactQueryClientProvider } from '@/app/_lib/providers/ReactQueryProvider';

export const metadata: Metadata = {
	title: 'Taqseem',
};

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {

	return (
		<ReactQueryClientProvider>
			<html lang="en" data-theme='dark' suppressHydrationWarning>
				<body className={inter.className}>
					{/* <AuthProvider session={session} refetchInterval={1000}> */}
					<ChakraProvider>{children}</ChakraProvider>
					{/* </AuthProvider> */}
				</body>
			</html>
		</ReactQueryClientProvider>
	);
}