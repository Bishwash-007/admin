import Navbar from '@/components/Navbar';
import AuthGuard from '@/components/ui/AuthGuard';

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<AuthGuard>
			<main className="flex h-screen overflow-hidden flex-row">
				<Navbar />
				<div className="flex-1 overflow-y-auto">{children}</div>
			</main>
		</AuthGuard>
	);
}
