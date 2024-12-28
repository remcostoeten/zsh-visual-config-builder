export type GithubUser = {
	id: number;
	login: string;
	email: string;
	avatar_url: string;
};

export type GithubTokenResponse = {
	access_token: string;
};
