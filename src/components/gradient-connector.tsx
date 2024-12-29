export type GradientConnectorProps = {
	start: { x: number; y: number };
	end: { x: number; y: number };
	settings: ConnectorSettings;
};

export default function GradientConnector({
	start,
	end,
	settings,
}: GradientConnectorProps) {
	const gradientId = `gradient-${start.x}-${start.y}-${end.x}-${end.y}`;

	const midX = start.x + (end.x - start.x) / 2;
	const path = `
    M ${start.x} ${start.y}
    C ${midX} ${start.y},
      ${midX} ${end.y},
      ${end.x} ${end.y}
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
			aria-label="Gradient connector line"
		>
			<title>Gradient connector line between nodes</title>
			<defs>
				<linearGradient
					id={gradientId}
					gradientUnits="userSpaceOnUse"
					x1={start.x}
					y1={start.y}
					x2={end.x}
					y2={end.y}
				>
					<stop
						offset="0%"
						stopColor={settings.connectorColor}
						stopOpacity="0.8"
					/>
					<stop
						offset="100%"
						stopColor={settings.connectorColor}
						stopOpacity="0.2"
					/>
				</linearGradient>
			</defs>
			<path
				d={path}
				stroke={`url(#${gradientId})`}
				strokeWidth={settings.lineWidth}
				fill="none"
			/>
		</svg>
	);
}
