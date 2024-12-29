export type StepConnectorProps = {
	start: { x: number; y: number };
	end: { x: number; y: number };
	settings: ConnectorSettings;
};

export default function StepConnector({
	start,
	end,
	settings,
}: StepConnectorProps) {
	// Calculate middle point for the step
	const midX = start.x + (end.x - start.x) / 2;

	const path = `
    M ${start.x} ${start.y}
    L ${midX} ${start.y}
    L ${midX} ${end.y}
    L ${end.x} ${end.y}
  `;

	return (
		<svg
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				pointerEvents: 'none',
				overflow: 'visible',
			}}
			role="img"
			aria-label="Step connector line"
		>
			<title>Step connector line between nodes</title>
			<path
				d={path}
				stroke={settings.connectorColor}
				strokeWidth={settings.lineWidth}
				fill="none"
				strokeLinejoin="round"
				className="opacity-60"
			/>
		</svg>
	);
}
