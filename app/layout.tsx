import './globals.css';
import { ChakraProvider } from "@chakra-ui/react"
import type { Metadata } from 'next';
import { Inter } from 'next/font/google'
import { SessionProvider } from '@/app/utils/AuthProvider';
import { getServerSession } from 'next-auth';
import customTheme from './utils/CustomTheme';

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
					<ChakraProvider theme={customTheme}>
						{children}
					</ChakraProvider>
				</SessionProvider>
			</body>
		</html>
	);
}