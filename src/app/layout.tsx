import './globals.css';

import type { Metadata } from 'next';

import ChakraProvider from '@/lib/providers/ChakraProvider';
// import { AuthProvider } from '@/lib/providers/AuthProvider';
import { ReactQueryClientProvider } from '@/lib/providers/ReactQueryProvider';

export const metadata: Metadata = {
	title: 'Taqseem',
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {

	return (
		<ReactQueryClientProvider>
			<html lang="en" data-theme='dark' suppressHydrationWarning>
				<body>
					{/* <AuthProvider session={session} refetchInterval={1000}> */}
					<ChakraProvider>{children}</ChakraProvider>
					{/* </AuthProvider> */}
				</body>
			</html>
		</ReactQueryClientProvider>
	);
}