'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
	const router = useRouter();
	const { isAuthenticated, user } = useAuthStore();

	useEffect(() => {
		if (!isAuthenticated) {
			router.replace('/login');
			return;
		}
		if (user?.role !== 'admin') {
			router.replace('/login');
		}
	}, [isAuthenticated, user, router]);

	// Don't render anything until we confirm admin
	if (!isAuthenticated || user?.role !== 'admin') return null;

	return <>{children}</>;
};

export default AuthGuard;
