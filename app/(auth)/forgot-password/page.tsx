'use client';

import Button from '@/components/ui/Button';
import InputField from '@/components/ui/InputField';
import { useUiStore } from '@/stores';
import { authService } from '@/services';
import { Clapperboard } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const ForgotPassword = () => {
	const { showToast } = useUiStore();
	const [submitted, setSubmitted] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (formData: FormData) => {
		const email = formData.get('email') as string;
		setIsLoading(true);
		try {
			await authService.forgotPassword({ email });
			setSubmitted(true);
		} catch (err) {
			const message =
				err instanceof Error ? err.message : 'Something went wrong';
			showToast(message, 'error');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center p-8">
			<div className="w-full max-w-sm">
				<div className="flex items-center gap-2 mb-8">
					<Clapperboard size={22} strokeWidth={2.5} />
					<span className="text-lg font-black">Cinema Ghar</span>
				</div>

				{submitted ? (
					<div className="border-2 border-black p-6 shadow-[4px_4px_0_0_#000]">
						<h1 className="text-3xl font-black mb-1">Check your email</h1>
						<p className="text-sm text-gray-500 mb-6">
							If an account with that email exists, we&apos;ve sent a password
							reset link.
						</p>
						<Link
							href="/login"
							className="text-sm font-black underline underline-offset-2 hover:opacity-60"
						>
							← Back to login
						</Link>
					</div>
				) : (
					<>
						<h1 className="text-3xl font-black mb-1">Forgot password?</h1>
						<p className="text-sm text-gray-500 mb-8">
							Enter your email and we&apos;ll send you a reset link.
						</p>

						<form action={handleSubmit} className="flex flex-col gap-4">
							<InputField
								type="email"
								name="email"
								placeholder="Email address"
								autoComplete="email"
								required
							/>
							<Button
								title={isLoading ? 'Sending...' : 'Send reset link'}
								type="submit"
								disabled={isLoading}
							/>
						</form>

						<p className="text-sm text-center mt-6">
							<Link
								href="/login"
								className="font-black underline underline-offset-2 hover:opacity-60"
							>
								← Back to login
							</Link>
						</p>
					</>
				)}
			</div>
		</div>
	);
};

export default ForgotPassword;
