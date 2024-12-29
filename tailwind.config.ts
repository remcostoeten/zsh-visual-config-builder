import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
	theme: {
		extend: {
			colors: {
				background: 'var(--background)',
				foreground: 'var(--foreground)',
				// Adding some useful color variables for our editor themes
				monokai: {
					bg: '#272822',
					fg: '#f8f8f2',
				},
				'one-dark': {
					bg: '#282c34',
					fg: '#abb2bf',
				},
				'tokyo-night': {
					bg: '#1a1b26',
					fg: '#a9b1d6',
				},
				'night-owl': {
					bg: '#011627',
					fg: '#d6deeb',
				},
				synthwave: {
					bg: '#2b213a',
					fg: '#ff7edb',
				},
			},
			animation: {
				gradient: 'gradient 3s ease infinite',
			},
			keyframes: {
				gradient: {
					'0%, 100%': {
						'background-size': '200% 200%',
						'background-position': 'left center',
					},
					'50%': {
						'background-size': '200% 200%',
						'background-position': 'right center',
					},
				},
			},
		},
	},
	plugins: [],
} satisfies Config;
