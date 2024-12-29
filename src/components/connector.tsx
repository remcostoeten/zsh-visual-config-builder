interface Props {
	start: { x: number; y: number };
	end: { x: number; y: number };
}

export default function Connector({ start, end }: Props) {
	const path = `M ${start.x} ${start.y} C ${start.x} ${(start.y + end.y) / 2}, ${end.x} ${(start.y + end.y) / 2}, ${end.x} ${end.y}`;

	return (
		<svg role="img" aria-label="Connection line">
			<title>Connection line between nodes</title>
			<path
				d={path}
				stroke="rgb(99 102 241)"
				strokeWidth="2"
				fill="none"
				strokeDasharray="4"
				className="animate-dash"
			/>
		</svg>
	);
}
