'use client';

import { Maximize2, Minimize2 } from 'lucide-react';
import React from 'react';

type FullscreenButtonProps = {
	isFullscreen: boolean;
	onClick: () => void;
};

const buttonStyles: React.CSSProperties = {
	width: '25px',
	height: '25px',
	border: 'none',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	backgroundColor: 'transparent',
	cursor: 'pointer',
	transition: 'all 0.3s',
	position: 'relative',
	overflow: 'hidden',
	color: 'white',
};

export default function FullscreenButton({
	isFullscreen,
	onClick,
}: FullscreenButtonProps) {
	const [isHovered, setIsHovered] = React.useState(false);

	return (
		<button
			type="button"
			onClick={onClick}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			style={{
				...buttonStyles,
				...(isHovered && {
					width: '30px',
					height: '30px',
					overflow: 'visible',
				}),
			}}
		>
			{isFullscreen ? (
				<Minimize2 style={{ height: '100%', strokeWidth: 1.5 }} />
			) : (
				<Maximize2 style={{ height: '100%', strokeWidth: 1.5 }} />
			)}
		</button>
	);
}
