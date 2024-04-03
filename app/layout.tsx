import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google'
import { auth } from '@/auth';

import AuthProvider from '@/app/_lib/providers/AuthProvider';
import ChakraProvider from '@/app/_lib/providers/ChakraProvider';

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
				<AuthProvider session={session!}>
					<ChakraProvider>{children}</ChakraProvider>
				</AuthProvider>
			</body>
		</html>
	);
}