import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google'
import { getServerSession } from 'next-auth';

import { SessionProvider } from '@/app/utils/authProvider';
import { Providers } from '@/app/utils/providers';

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
				<SessionProvider session={session}>
					<Providers>{children}</Providers>
				</SessionProvider>
			</body>
		</html>
	);
}