'use client';
import { useAuthStore } from '@/stores';
import { useRouter } from 'next/navigation';

const Index = () => {
	const router = useRouter();
	const { isAuthenticated } = useAuthStore();
	if (!isAuthenticated) {
		return router.push('/login');
	}
	return router.push('/home');
};

export default Index;
