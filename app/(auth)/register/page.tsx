'use client';

import Button from '@/components/ui/Button';
import InputField from '@/components/ui/InputField';
import { useAuthStore, useUiStore } from '@/stores';
import { useRouter } from 'next/navigation';

const SignUp = () => {
	const router = useRouter();
	const { register, isLoading, clearError } = useAuthStore();
	const { showToast } = useUiStore();

	const handleSignUp = async (formData: FormData) => {
		clearError();
		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		try {
			await register({ name, email, password });
			showToast('Account created successfully', 'success');
			router.push('/login');
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Sign up failed';
			showToast(message, 'error');
		}
	};

	return (
		<div className="min-h-screen items-center justify-center flex">
			<form action={handleSignUp} className="flex flex-col items-center gap-4">
				<h1 className="text-2xl font-bold mb-2">Register Admin</h1>

				<InputField
					type="text"
					name="name"
					placeholder="Name"
					autoComplete="name"
					required
				/>
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
					title={isLoading ? 'Signing up...' : 'SignUp'}
					type="submit"
					disabled={isLoading}
				/>
			</form>
		</div>
	);
};

export default SignUp;
