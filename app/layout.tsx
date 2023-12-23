import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google'
import { getServerSession } from 'next-auth';

import AuthProvider from '@/client/providers/authProvider';
import { Providers } from '@/client/providers/chakraProviders';

export const metadata: Metadata = {
	title: 'Taqseem',
};

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerSession();

	return (
		<html lang="en" data-theme='dark'>
			<body className={inter.className}>
				<AuthProvider session={session}>
					<Providers>{children}</Providers>
				</AuthProvider>
			</body>
		</html>
	);
}