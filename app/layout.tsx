import type { Metadata } from 'next';
import './globals.css';
import Toaster from '@/components/ui/Toaster';

export const metadata: Metadata = {
	title: 'Cinema Admin',
	description: 'Cinema admin panel',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="antialiased">
				{children}
				<Toaster />
			</body>
		</html>
	);
}
