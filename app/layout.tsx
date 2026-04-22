import type { Metadata } from 'next';
import Toaster from '@/components/ui/Toaster';
import './globals.css';

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
