"use client";

import React, { useState, useEffect } from "react";
import { Alert, AlertTitle, AlertDescription } from "ui";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "helpers";

interface RateLimitMessageProps {
	resetAt: Date | null;
	onDismiss?: () => void;
	variant?: "inline" | "bar" | "fixed";
	position?:
		| "top"
		| "bottom"
		| "top-left"
		| "top-right"
		| "bottom-left"
		| "bottom-right"
		| "bottom-center"
		| "top-center";
}

export const RateLimitMessage = ({
	resetAt,
	onDismiss,
	variant = "fixed",
	position = "bottom-right",
}: RateLimitMessageProps) => {
	const [timeLeft, setTimeLeft] = useState<string>("0:00");
	const [isDismissed, setIsDismissed] = useState(false);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		if (!resetAt) return;

		const updateTimeLeft = () => {
			const now = new Date();
			const diff = resetAt.getTime() - now.getTime();

			if (diff <= 0) {
				setTimeLeft("0:00");
				return;
			}

			const minutes = Math.floor(diff / 60000);
			const seconds = Math.floor((diff % 60000) / 1000);
			setTimeLeft(`${minutes}:${seconds.toString().padStart(2, "0")}`);
		};

		updateTimeLeft();
		const interval = setInterval(updateTimeLeft, 1000);
		setIsVisible(true);
		return () => clearInterval(interval);
	}, [resetAt]);

	if (!resetAt || isDismissed) return null;

	const variantClasses = {
		inline: "w-full",
		bar: "w-full fixed left-0",
		fixed: "fixed max-w-md",
	};

	const positionClasses = {
		top: "top-0 left-0 right-0",
		bottom: "bottom-0 left-0 right-0",
		"top-left": "top-4 left-4",
		"top-right": "top-4 right-4",
		"bottom-left": "bottom-4 left-4",
		"bottom-right": "bottom-4 right-4",
		"bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
		"top-center": "top-0 left-1/2 transform -translate-x-1/2",
	};

	const wrapperClasses = cn(
		"z-[9999]",
		variantClasses[variant],
		variant !== "inline" && positionClasses[position],
		variant === "bar" && "flex items-center justify-between px-4 py-2",
		isVisible ? "opacity-100" : "opacity-0",
		"transition-opacity duration-500 ease-[cubic-bezier(0.4, 0, 0.2, 1)]",
	);

	return (
		<div className={wrapperClasses}>
			<Alert
				className={cn(
					"border-[rgb(127,35,21)] bg-[rgb(127,35,21,0.4)]",
					variant === "bar" && "flex-row items-center justify-between",
				)}
			>
				<div
					className={cn(
						"flex",
						variant === "bar" ? "flex-row items-center" : "flex-col",
					)}
				>
					<AlertTitle
						className={cn(
							"flex items-center text-[rgb(229,72,77)]",
							variant === "bar" ? "mr-4" : "justify-between",
						)}
					>
						<span className="mr-2">Rate Limit Reached</span>
						{variant !== "bar" && (
							<Button
								variant="ghost"
								size="sm"
								className="h-auto p-0 hover:bg-transparent text-[rgb(229,72,77)] hover:text-[rgb(255,100,105)]"
								onClick={() => {
									setIsDismissed(true);
									onDismiss?.();
								}}
							>
								<X className="h-4 w-4" />
							</Button>
						)}
					</AlertTitle>
					<AlertDescription
						className={cn(
							"text-[rgba(229,72,77,0.7)]",
							variant === "bar" && "flex-1",
						)}
					>
						<div
							className={cn(
								"flex items-center",
								variant === "bar" ? "justify-center" : "flex-wrap gap-1",
							)}
						>
							<span>Please wait</span>
							<span className="w-[4.5ch] inline-block text-center">
								{timeLeft}
							</span>
							<span>before trying again</span>
						</div>
					</AlertDescription>
				</div>
				{variant === "bar" && (
					<Button
						variant="ghost"
						size="sm"
						className="h-auto p-0 hover:bg-transparent text-[rgb(229,72,77)] hover:text-[rgb(255,100,105)]"
						onClick={() => {
							setIsDismissed(true);
							onDismiss?.();
						}}
					>
						<X className="h-4 w-4" />
					</Button>
				)}
			</Alert>
		</div>
	);
};
