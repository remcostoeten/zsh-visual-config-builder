import { parse } from 'shell-parse';

export function validateShellScript(code: string): {
	isValid: boolean;
	error?: string;
} {
	try {
		parse(code);
		return { isValid: true };
	} catch (error) {
		return {
			isValid: false,
			error: error instanceof Error ? error.message : 'Invalid shell syntax',
		};
	}
}
