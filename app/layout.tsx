import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google'
import { auth } from '@/auth';

import ChakraProvider from '@/app/_lib/providers/ChakraProvider';
import { SessionProvider } from 'next-auth/react';

export const metadata: Metadata = {
	title: 'Taqseem',
};

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();

	return (
		<html lang="en" data-theme='dark'>
			<body className={inter.className}>
				<SessionProvider session={session}>
					<ChakraProvider>{children}</ChakraProvider>
				</SessionProvider>
			</body>
		</html>
	);
}