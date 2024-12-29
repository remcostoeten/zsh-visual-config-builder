"use client";

import { useEffect, useRef, useState } from "react";
import {
	useFloating,
	offset,
	flip,
	shift,
	autoUpdate,
} from "@floating-ui/react-dom-interactions";

interface FPopoverProps {
	trigger: React.ReactNode;
	content: React.ReactNode;
	openOnHover?: boolean;
}

export function FPopover({ trigger, content, openOnHover }: FPopoverProps) {
	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLDivElement>(null);

	const { x, y, strategy, refs, update } = useFloating({
		placement: "bottom",
		middleware: [offset(8), flip(), shift()],
	});

	useEffect(() => {
		if (!refs.reference.current || !refs.floating.current) return;

		return autoUpdate(refs.reference.current, refs.floating.current, update);
	}, [refs.reference, refs.floating, update]);

	const handleMouseEnter = () => {
		if (openOnHover) setIsOpen(true);
	};

	const handleMouseLeave = () => {
		if (openOnHover) setIsOpen(false);
	};

	const handleClick = () => {
		if (!openOnHover) setIsOpen(!isOpen);
	};

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === "Enter" || event.key === " ") {
			handleClick();
		}
	};

	return (
		<div
			ref={triggerRef}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
		>
			<div ref={refs.reference as React.RefObject<HTMLDivElement>}>
				{trigger}
			</div>
			{isOpen && (
				<div
					ref={refs.floating as React.RefObject<HTMLDivElement>}
					style={{
						position: strategy,
						top: y ?? 0,
						left: x ?? 0,
						width: "max-content",
					}}
					className="z-50 bg-popover text-popover-foreground shadow-md rounded-md transition-opacity duration-200 ease-in-out opacity-0 transform scale-95"
				>
					{content}
				</div>
			)}
		</div>
	);
}
