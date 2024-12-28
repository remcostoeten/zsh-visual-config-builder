import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "default" | "outline";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant = "default", ...props }, ref) => {
		return (
			<button
				ref={ref}
				className={cn(
					"inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
					"disabled:pointer-events-none disabled:opacity-50",
					variant === "default" &&
						"bg-primary text-primary-foreground hover:bg-primary/90",
					variant === "outline" &&
						"border border-input bg-background hover:bg-accent hover:text-accent-foreground",
					className,
				)}
				{...props}
			/>
		);
	},
);
