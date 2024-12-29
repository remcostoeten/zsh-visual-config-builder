'use client';

import { supabase } from '@/lib/supabase';
import type { Profile } from '@/lib/supabase';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
	userId: string;
};

export default function OnboardingForm({ userId }: Props) {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [formData, setFormData] = useState<Partial<Profile>>({
		user_id: userId,
		username: '',
		full_name: '',
		discovery_source: '',
		operating_system: 'linux' as const,
		shell: 'zsh' as const,
		custom_profile_slug: '',
	});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		const profileSlug = formData.custom_profile_slug || formData.username;

		const { error: upsertError } = await supabase.from('profiles').upsert({
			...formData,
			custom_profile_slug: profileSlug,
		});

		if (upsertError) {
			setError(upsertError.message);
			setIsLoading(false);
			return;
		}

		navigate(`/profile/${profileSlug}`);
	};

	return (
		<div className="max-w-2xl mx-auto p-6">
			<h1 className="text-2xl font-bold mb-6">Complete Your Profile</h1>
			<form onSubmit={handleSubmit} className="space-y-6">
				<div>
					<label htmlFor="username" className="block text-sm font-medium">
						Username*
					</label>
					<input
						type="text"
						id="username"
						name="username"
						required
						value={formData.username}
						onChange={handleChange}
						className="mt-1 block w-full rounded-md border p-2"
					/>
				</div>

				<div>
					<label htmlFor="full_name" className="block text-sm font-medium">
						Full Name
					</label>
					<input
						type="text"
						id="full_name"
						name="full_name"
						value={formData.full_name}
						onChange={handleChange}
						className="mt-1 block w-full rounded-md border p-2"
					/>
				</div>

				<div>
					<label
						htmlFor="discovery_source"
						className="block text-sm font-medium"
					>
						How did you find us?
					</label>
					<select
						id="discovery_source"
						name="discovery_source"
						value={formData.discovery_source}
						onChange={handleChange}
						className="mt-1 block w-full rounded-md border p-2"
					>
						<option value="">Select an option</option>
						<option value="github">GitHub</option>
						<option value="twitter">Twitter</option>
						<option value="search">Search Engine</option>
						<option value="friend">Friend Recommendation</option>
						<option value="other">Other</option>
					</select>
				</div>

				<div>
					<label
						htmlFor="operating_system"
						className="block text-sm font-medium"
					>
						Operating System
					</label>
					<select
						id="operating_system"
						name="operating_system"
						value={formData.operating_system}
						onChange={handleChange}
						className="mt-1 block w-full rounded-md border p-2"
					>
						<option value="linux">Linux</option>
						<option value="mac">Mac</option>
						<option value="windows">Windows</option>
					</select>
				</div>

				<div>
					<label htmlFor="shell" className="block text-sm font-medium">
						Preferred Shell
					</label>
					<select
						id="shell"
						name="shell"
						value={formData.shell}
						onChange={handleChange}
						className="mt-1 block w-full rounded-md border p-2"
					>
						<option value="zsh">Zsh</option>
						<option value="bash">Bash</option>
					</select>
				</div>

				<div>
					<label
						htmlFor="custom_profile_slug"
						className="block text-sm font-medium"
					>
						Custom Profile URL (optional)
					</label>
					<div className="flex items-center mt-1">
						<span className="text-gray-500">
							{window.location.origin}/profile/
						</span>
						<input
							type="text"
							id="custom_profile_slug"
							name="custom_profile_slug"
							value={formData.custom_profile_slug}
							onChange={handleChange}
							placeholder={formData.username}
							className="block w-full rounded-md border p-2"
						/>
					</div>
				</div>

				{error && <p className="text-red-600 text-sm">{error}</p>}

				<button
					type="submit"
					disabled={isLoading}
					className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
				>
					{isLoading ? 'Saving...' : 'Complete Profile'}
				</button>
			</form>
		</div>
	);
}
