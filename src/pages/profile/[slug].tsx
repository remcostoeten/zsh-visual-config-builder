'use client';

import { supabase } from '@/lib/supabase';
import type { Profile } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ProfilePage() {
	const { slug } = useParams<{ slug: string }>();
	const [profile, setProfile] = useState<Profile | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchProfile = async () => {
			setIsLoading(true);
			setError(null);

			const { data, error } = await supabase
				.from('profiles')
				.select('*')
				.or(`custom_profile_slug.eq.${slug},username.eq.${slug}`)
				.single();

			if (error) {
				setError('Profile not found');
			} else {
				setProfile(data);
			}

			setIsLoading(false);
		};

		fetchProfile();
	}, [slug]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
			</div>
		);
	}

	if (error || !profile) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen">
				<h1 className="text-2xl font-bold text-red-600">Profile Not Found</h1>
				<p className="mt-2 text-gray-600">
					The profile you're looking for doesn't exist.
				</p>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto p-6">
			<div className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800">
				<div className="flex items-center space-x-4">
					{profile.avatar_url && (
						<img
							src={profile.avatar_url}
							alt={`${profile.username}'s avatar`}
							className="w-20 h-20 rounded-full"
						/>
					)}
					<div>
						<h1 className="text-2xl font-bold">
							{profile.full_name || profile.username}
						</h1>
						<p className="text-gray-600 dark:text-gray-400">
							@{profile.username}
						</p>
					</div>
				</div>

				<div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<h2 className="text-lg font-semibold">System Preferences</h2>
						<p className="text-gray-600 dark:text-gray-400">
							<span className="font-medium">OS:</span>{' '}
							{profile.operating_system}
						</p>
						<p className="text-gray-600 dark:text-gray-400">
							<span className="font-medium">Shell:</span> {profile.shell}
						</p>
					</div>

					<div className="space-y-2">
						<h2 className="text-lg font-semibold">Profile Info</h2>
						<p className="text-gray-600 dark:text-gray-400">
							<span className="font-medium">Joined:</span>{' '}
							{new Date(profile.created_at).toLocaleDateString()}
						</p>
						{profile.discovery_source && (
							<p className="text-gray-600 dark:text-gray-400">
								<span className="font-medium">Found via:</span>{' '}
								{profile.discovery_source}
							</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
