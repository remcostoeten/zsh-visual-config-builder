'use client';

import { supabase } from '@/lib/supabase';
import { useState } from 'react';

type Props = {
	onSuccess: () => void;
};

export default function AuthForm({ onSuccess }: Props) {
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);

	const handleEmailSignIn = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			setError(error.message);
		} else {
			onSuccess();
		}
		setIsLoading(false);
	};

	const handleEmailSignUp = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		const { error } = await supabase.auth.signUp({
			email,
			password,
		});

		if (error) {
			setError(error.message);
		} else {
			onSuccess();
		}
		setIsLoading(false);
	};

	const handleGitHubSignIn = async () => {
		setIsLoading(true);
		setError(null);

		const { error } = await supabase.auth.signInWithOAuth({
			provider: 'github',
			options: {
				redirectTo: `${window.location.origin}/onboarding`,
			},
		});

		if (error) {
			setError(error.message);
		}
		setIsLoading(false);
	};

	return (
		<div className="w-full max-w-md p-6 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
			<form onSubmit={handleEmailSignIn} className="space-y-4">
				<div>
					<label
						htmlFor="email"
						className="block text-sm font-medium text-gray-700 dark:text-gray-200"
					>
						Email
					</label>
					<input
						type="email"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full px-3 py-2 mt-1 border rounded-md"
						required
					/>
				</div>
				<div>
					<label
						htmlFor="password"
						className="block text-sm font-medium text-gray-700 dark:text-gray-200"
					>
						Password
					</label>
					<input
						type="password"
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full px-3 py-2 mt-1 border rounded-md"
						required
					/>
				</div>
				{error && <p className="text-sm text-red-600">{error}</p>}
				<div className="flex gap-4">
					<button
						type="submit"
						disabled={isLoading}
						className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
					>
						Sign In
					</button>
					<button
						type="button"
						onClick={handleEmailSignUp}
						disabled={isLoading}
						className="flex-1 px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
					>
						Sign Up
					</button>
				</div>
			</form>
			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<div className="w-full border-t border-gray-300" />
				</div>
				<div className="relative flex justify-center text-sm">
					<span className="px-2 text-gray-500 bg-white dark:bg-gray-800">
						Or continue with
					</span>
				</div>
			</div>
			<button
				type="button"
				onClick={handleGitHubSignIn}
				disabled={isLoading}
				className="w-full px-4 py-2 text-white bg-gray-800 rounded-md hover:bg-gray-900 flex items-center justify-center gap-2"
			>
				<svg
					className="w-5 h-5"
					fill="currentColor"
					viewBox="0 0 24 24"
					role="img"
					aria-label="GitHub logo"
				>
					<title>GitHub logo</title>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"
					/>
				</svg>
				Continue with GitHub
			</button>
		</div>
	);
}
