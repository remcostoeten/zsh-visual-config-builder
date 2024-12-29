export type DottedMarkerConnectorProps = {
	start: { x: number; y: number };
	end: { x: number; y: number };
	settings: ConnectorSettings;
};

export default function DottedMarkerConnector({
	start,
	end,
	settings,
}: DottedMarkerConnectorProps) {
	const markerId = `marker-${start.x}-${start.y}-${end.x}-${end.y}`;

	// Add a curve with control points
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
			aria-label="Dotted marker connector line"
		>
			<title>Dotted marker connector line between nodes</title>
			<defs>
				<marker
					id={markerId}
					viewBox="0 0 10 10"
					refX="8"
					refY="5"
					markerWidth="6"
					markerHeight="6"
					orient="auto"
				>
					<path
						d="M 0 0 L 10 5 L 0 10 z"
						fill={settings.connectorColor}
						className="opacity-60"
					/>
				</marker>
			</defs>
			<path
				d={path}
				stroke={settings.connectorColor}
				strokeWidth={settings.lineWidth}
				fill="none"
				strokeDasharray="2 4"
				markerEnd={`url(#${markerId})`}
				className="opacity-60"
			/>
		</svg>
	);
}
