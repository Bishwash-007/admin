import Navbar from '@/components/Navbar';

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<main className="flex min-h-screen flex-row">
			<Navbar />
			{children}
		</main>
	);
}
