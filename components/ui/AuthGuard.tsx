'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
	const router = useRouter();
	const { isAuthenticated, user, _hasHydrated } = useAuthStore();

	useEffect(() => {
		if (_hasHydrated) {
			if (!isAuthenticated || user?.role !== 'admin') {
				router.replace('/login');
			}
		}
	}, [isAuthenticated, user, router, _hasHydrated]);

	// Don't render anything until we confirm admin
	if (!_hasHydrated) return null;

	if (!isAuthenticated || user?.role !== 'admin') return null;

	return <>{children}</>;
};

export default AuthGuard;
