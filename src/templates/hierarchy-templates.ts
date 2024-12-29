import type { ConfigNode } from '../types/config';

export const hierarchyTemplates = {
	basic: {
		id: 'root',
		type: 'main',
		title: 'Main Configuration',
		content: '# Main ZSH Configuration',
		level: 1,
		children: [
			{
				id: 'env',
				type: 'injector',
				title: 'Environment Variables',
				content: `# Environment Setup
export PATH="$HOME/.local/bin:$PATH"
export EDITOR="vim"
export LANG="en_US.UTF-8"`,
				level: 2,
				dependsOn: ['root'],
				children: [],
			},
			{
				id: 'aliases',
				type: 'partial',
				title: 'Common Aliases',
				content: `# Common Aliases
alias ll='ls -la'
alias ..='cd ..'
alias c='clear'`,
				level: 2,
				dependsOn: ['root'],
				children: [
					{
						id: 'git-aliases',
						type: 'partial',
						title: 'Git Aliases',
						content: `# Git Aliases
alias gs='git status'
alias gc='git commit'
alias gp='git push'`,
						level: 3,
						dependsOn: ['aliases'],
						children: [],
					},
				],
			},
		],
	},
	development: {
		id: 'root',
		type: 'main',
		title: 'Development Setup',
		content: '# Development Environment Configuration',
		level: 1,
		children: [
			{
				id: 'node-setup',
				type: 'injector',
				title: 'Node.js Setup',
				content: `# Node.js Environment
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"`,
				level: 2,
				dependsOn: ['root'],
				children: [
					{
						id: 'npm-aliases',
						type: 'partial',
						title: 'NPM Shortcuts',
						content: `# NPM Aliases
alias ni='npm install'
alias nr='npm run'
alias nrd='npm run dev'`,
						level: 3,
						dependsOn: ['node-setup'],
						children: [],
					},
				],
			},
			{
				id: 'docker-setup',
				type: 'injector',
				title: 'Docker Setup',
				content: `# Docker Environment
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1`,
				level: 2,
				dependsOn: ['root'],
				children: [
					{
						id: 'docker-aliases',
						type: 'partial',
						title: 'Docker Aliases',
						content: `# Docker Aliases
alias d='docker'
alias dc='docker-compose'
alias dps='docker ps'`,
						level: 3,
						dependsOn: ['docker-setup'],
						children: [],
					},
				],
			},
		],
	},
} as const;

export type TemplateKey = keyof typeof hierarchyTemplates;

export function createFromTemplate(templateKey: TemplateKey): ConfigNode {
	const template = hierarchyTemplates[templateKey];
	return JSON.parse(JSON.stringify(template)); // Deep clone to avoid mutations
}

export function getTemplateList(): Array<{ key: TemplateKey; title: string }> {
	return Object.entries(hierarchyTemplates).map(([key, template]) => ({
		key: key as TemplateKey,
		title: template.title,
	}));
}
