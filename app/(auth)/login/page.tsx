'use client';

import Button from '@/components/ui/Button';
import InputField from '@/components/ui/InputField';
import { useAuthStore, useUiStore } from '@/stores';
import { useRouter } from 'next/navigation';

const Login = () => {
	const router = useRouter();
	const { login, isLoading, clearError } = useAuthStore();
	const { showToast } = useUiStore();

	const handleLogin = async (formData: FormData) => {
		clearError();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		try {
			await login({ email, password });
			showToast('Logged in successfully', 'success');
			router.push('/home');
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Login failed';
			showToast(message, 'error');
		}
	};

	return (
		<div className="min-h-screen items-center justify-center flex">
			<form action={handleLogin} className="flex flex-col items-center gap-4">
				<h1 className="text-2xl font-bold mb-2">Admin Login</h1>

				<InputField
					type="email"
					name="email"
					placeholder="Email"
					autoComplete="email"
					required
				/>

				<InputField
					type="password"
					name="password"
					placeholder="Password"
					required
				/>

				<Button
					title={isLoading ? 'Logging in...' : 'Login'}
					type="submit"
					disabled={isLoading}
				/>
			</form>
		</div>
	);
};

export default Login;
