import React from 'react';
import type { ConnectorSettings } from '../types/settings';

interface Props {
	path: string;
	settings: ConnectorSettings;
}

export default function AnimatedConnector({ path, settings }: Props) {
	const { color = '#333', width = 2, animate = true } = settings;

	return (
		<svg
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				pointerEvents: 'none',
				zIndex: -1,
			}}
			role="img"
			aria-label="Connector line"
		>
			<title>Connector line</title>
			<path
				d={path}
				stroke={color}
				strokeWidth={width}
				fill="none"
				strokeDasharray={animate ? '5,5' : undefined}
			/>
		</svg>
	);
}
