'use client';

import Button from '@/components/ui/Button';
import InputField from '@/components/ui/InputField';
import { useAuthStore, useUiStore } from '@/stores';
import { Clapperboard } from 'lucide-react';
import Link from 'next/link';
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
		<div className="min-h-screen flex">
			{/* Left panel */}
			<div className="hidden lg:flex flex-col justify-between w-1/2 p-12">
				<div className="flex items-center gap-3">
					<Clapperboard size={28} strokeWidth={2.5} />
					<span className="text-xl font-black tracking-tight">Cinema Ghar</span>
				</div>

				{/* Illustration */}
				<div className="flex flex-col items-center gap-8">
					<div className="text-center">
						<h2 className="text-3xl font-black leading-tight mb-3">
							Your cinema.
							<br />
							Your control.
						</h2>
						<p className="text-gray-500 text-sm leading-relaxed max-w-sm">
							Create your admin account to start managing movies, theatres, and
							bookings.
						</p>
					</div>
				</div>

				<p className="text-xs text-gray-400">
					© {new Date().getFullYear()} Cinema Ghar
				</p>
			</div>

			{/* Right panel */}
			<div className="flex flex-1 items-center justify-center p-8">
				<div className="w-full max-w-sm">
					{/* Mobile brand */}
					<div className="flex items-center gap-2 mb-8 lg:hidden">
						<Clapperboard size={22} strokeWidth={2.5} />
						<span className="text-lg font-black">Cinema Ghar</span>
					</div>

					<h1 className="text-3xl font-black mb-1">Create account</h1>
					<p className="text-sm text-gray-500 mb-8">
						Set up your admin account
					</p>

					<form action={handleSignUp} className="flex flex-col gap-4">
						<InputField
							type="text"
							name="name"
							placeholder="Full name"
							autoComplete="name"
							required
						/>
						<InputField
							type="email"
							name="email"
							placeholder="Email address"
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
							title={isLoading ? 'Creating account...' : 'Sign Up'}
							type="submit"
							disabled={isLoading}
						/>
					</form>

					<p className="text-sm text-center mt-6">
						Already have an account?{' '}
						<Link
							href="/login"
							className="font-black underline underline-offset-2 hover:opacity-60"
						>
							Sign in
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default SignUp;
