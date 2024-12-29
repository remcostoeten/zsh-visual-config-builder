import type { ConfigNode } from '../types/config';

export type SiteConfig = {
	name: string;
	description: string;
	url: string;
	author: {
		name: string;
		url: string;
		email?: string;
	};
	metadata: {
		keywords: string[];
		version: string;
		status: 'alpha' | 'beta' | 'stable';
		lastUpdated?: string;
	};
	navigation: {
		mainNav: NavItem[];
	};
	links: {
		github: string;
		docs?: string;
	};
	keywords?: string[];
	version: string;
};

export type NavItem = {
	title: string;
	href: string;
	disabled?: boolean;
};

export const configData: ConfigNode = {
	id: 'root',
	title: 'Main Config',
	content: '# Main ZSH Configuration\n\n# Your configuration here...',
	type: 'main',
	children: [
		{
			id: 'child1',
			title: 'Aliases',
			content: '# Common aliases\nalias ll="ls -la"\nalias ..="cd .."',
			type: 'partial',
			children: [],
		},
	],
};

export const siteConfig: SiteConfig = {
	name: 'Visual ZSH Config Builder',
	description:
		'Build, maintain and store your ZSH configuration visually with an intuitive interface',
	url: 'TBA',
	author: 'Remco Stoeten',
	repoUrl: 'https://github.com/remcostoeten/zsh-visual-config-builder',
	// scaffold wip
	version: '0.0.1',
	links: {
		github: 'https://github.com/remcostoeten/zsh-visual-config-builder',
		docs: '/docs',
	},
	mainNav: [
		{
			title: 'Home',
			href: '/',
		},
		{
			title: 'Documentation',
			href: '/docs',
		},
		{
			title: 'Config Builder',
			href: '/builder',
		},
	],
	keywords: [
		'zsh',
		'shell',
		'configuration',
		'terminal',
		'customization',
		'productivity',
	],
};
