'use client';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores';
import { useRouter } from 'next/navigation';

const Index = () => {
	const router = useRouter();
	const { isAuthenticated, _hasHydrated } = useAuthStore();

	useEffect(() => {
		if (_hasHydrated) {
			if (isAuthenticated) {
				router.push('/home');
			} else {
				router.push('/login');
			}
		}
	}, [isAuthenticated, router, _hasHydrated]);

	return null;
};

export default Index;
