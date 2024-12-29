import type { Monaco } from '@monaco-editor/react';

export const defineCustomThemes = (monaco: Monaco) => {
	// Monokai
	monaco.editor.defineTheme('monokai', {
		base: 'vs-dark',
		inherit: true,
		rules: [
			{ token: 'comment', foreground: '88846f', fontStyle: 'italic' },
			{ token: 'keyword', foreground: 'f92672' },
			{ token: 'string', foreground: 'e6db74' },
			{ token: 'number', foreground: 'ae81ff' },
		],
		colors: {
			'editor.background': '#272822',
			'editor.foreground': '#f8f8f2',
		},
	});

	// One Dark Pro
	monaco.editor.defineTheme('one-dark-pro', {
		base: 'vs-dark',
		inherit: true,
		rules: [
			{ token: 'comment', foreground: '5c6370', fontStyle: 'italic' },
			{ token: 'keyword', foreground: 'c678dd' },
			{ token: 'string', foreground: '98c379' },
			{ token: 'number', foreground: 'd19a66' },
		],
		colors: {
			'editor.background': '#282c34',
			'editor.foreground': '#abb2bf',
		},
	});

	// GitHub Theme
	monaco.editor.defineTheme('github-light', {
		base: 'vs',
		inherit: true,
		rules: [
			{ token: 'comment', foreground: '6a737d' },
			{ token: 'keyword', foreground: 'd73a49' },
			{ token: 'string', foreground: '032f62' },
			{ token: 'number', foreground: '005cc5' },
		],
		colors: {
			'editor.background': '#ffffff',
			'editor.foreground': '#24292e',
		},
	});

	// Nord Theme
	monaco.editor.defineTheme('nord', {
		base: 'vs-dark',
		inherit: true,
		rules: [
			{ token: 'comment', foreground: '616e88' },
			{ token: 'keyword', foreground: '81a1c1' },
			{ token: 'string', foreground: 'a3be8c' },
			{ token: 'number', foreground: 'b48ead' },
		],
		colors: {
			'editor.background': '#2e3440',
			'editor.foreground': '#d8dee9',
		},
	});

	// Material Theme
	monaco.editor.defineTheme('material-darker', {
		base: 'vs-dark',
		inherit: true,
		rules: [
			{ token: 'comment', foreground: '545454', fontStyle: 'italic' },
			{ token: 'keyword', foreground: '89DDFF' },
			{ token: 'string', foreground: 'C3E88D' },
			{ token: 'number', foreground: 'F78C6C' },
		],
		colors: {
			'editor.background': '#212121',
			'editor.foreground': '#EEFFFF',
		},
	});

	// Tokyo Night
	monaco.editor.defineTheme('tokyo-night', {
		base: 'vs-dark',
		inherit: true,
		rules: [
			{ token: 'comment', foreground: '565f89', fontStyle: 'italic' },
			{ token: 'keyword', foreground: '9d7cd8' },
			{ token: 'string', foreground: '9ece6a' },
			{ token: 'number', foreground: 'ff9e64' },
		],
		colors: {
			'editor.background': '#1a1b26',
			'editor.foreground': '#a9b1d6',
		},
	});

	// Night Owl
	monaco.editor.defineTheme('night-owl', {
		base: 'vs-dark',
		inherit: true,
		rules: [
			{ token: 'comment', foreground: '637777', fontStyle: 'italic' },
			{ token: 'keyword', foreground: 'c792ea' },
			{ token: 'string', foreground: 'ecc48d' },
			{ token: 'number', foreground: 'f78c6c' },
		],
		colors: {
			'editor.background': '#011627',
			'editor.foreground': '#d6deeb',
		},
	});

	// Synthwave '84
	monaco.editor.defineTheme('synthwave-84', {
		base: 'vs-dark',
		inherit: true,
		rules: [
			{ token: 'comment', foreground: '636363', fontStyle: 'italic' },
			{ token: 'keyword', foreground: 'fede5d' },
			{ token: 'string', foreground: 'ff8b39' },
			{ token: 'number', foreground: 'f97e72' },
		],
		colors: {
			'editor.background': '#2b213a',
			'editor.foreground': '#ff7edb',
		},
	});

	// Cobalt2
	monaco.editor.defineTheme('cobalt2', {
		base: 'vs-dark',
		inherit: true,
		rules: [
			{ token: 'comment', foreground: '0088ff', fontStyle: 'italic' },
			{ token: 'keyword', foreground: 'ff9d00' },
			{ token: 'string', foreground: '3ad900' },
			{ token: 'number', foreground: 'ff628c' },
		],
		colors: {
			'editor.background': '#193549',
			'editor.foreground': '#ffffff',
		},
	});
};
