import type { ConfigNode } from '../types/config';
import type { ConnectorSettings } from '../types/settings';

export function generateCommands(
	config: ConfigNode,
	basePath: string,
	settings: ConnectorSettings,
): string {
	const commands: string[] = [];

	const getShebang = () => {
		if (!settings.defaultShebang) return '';
		return `#!/usr/bin/${settings.shebangType}\n\n`;
	};

	const processNode = (node: ConfigNode) => {
		const filePath = `${basePath}/${node.title}`;
		commands.push(`mkdir -p $(dirname "${filePath}")`);
		const content = getShebang() + node.content;
		commands.push(`cat > "${filePath}" << 'EOL'\n${content}\nEOL`);
		commands.push(`chmod +x "${filePath}"`);
		node.children?.forEach(processNode);
	};

	processNode(config);
	return commands.join('\n');
}
