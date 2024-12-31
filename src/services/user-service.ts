export async function findUserByGithubId(githubId: string) {
	const response = await fetch(`/api/user?githubId=${githubId}`);
	if (!response.ok) {
		throw new Error('Failed to fetch user');
	}
	return response.json();
}

export async function createUser(userData: {
	githubId: string;
	name: string;
	email: string;
	avatarUrl?: string;
}) {
	const response = await fetch('/api/user', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(userData),
	});
	if (!response.ok) {
		throw new Error('Failed to create user');
	}
	return response.json();
}

export async function updateUserRole(userId: string, role: string) {
	const response = await fetch(`/api/user?userId=${userId}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ role }),
	});
	if (!response.ok) {
		throw new Error('Failed to update user role');
	}
	return response.json();
}
