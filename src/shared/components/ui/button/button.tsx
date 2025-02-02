import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { useTheme } from "next-themes"
import { cn } from '@/lib/utils'

interface FeyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

const LockIcon = ({ className }: { className?: string }) => {
  const { resolvedTheme } = useTheme()
  const strokeColor = resolvedTheme === 'dark' ? '#868F97' : '#4B5563'

  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        stroke={strokeColor}
        strokeWidth="1.5"
        d="M13.5 12.8053C14.2525 12.3146 14.75 11.4654 14.75 10.5C14.75 8.98122 13.5188 7.75 12 7.75C10.4812 7.75 9.25 8.98122 9.25 10.5C9.25 11.4654 9.74745 12.3146 10.5 12.8053L10.5 14.75C10.5 15.5784 11.1716 16.25 12 16.25C12.8284 16.25 13.5 15.5784 13.5 14.75L13.5 12.8053Z"
      />
      <circle
        cx="12"
        cy="12"
        r="9.25"
        stroke={strokeColor}
        strokeWidth="1.5"
      />
    </svg>
  )
}

export function FeyButton({
  className,
  children,
  ...props
}: FeyButtonProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <button
      className={cn(
        "group relative flex items-center justify-center gap-1",
        "h-8 min-w-[136px] whitespace-nowrap rounded-[28px] px-3 py-2",
        "text-sm font-semibold leading-tight",
        // Text color using CSS variables
        "text-foreground",
        // Base gradient
        isDark
          ? "bg-[radial-gradient(61.35%_50.07%_at_48.58%_50%,rgb(0,0,0)_0%,rgba(255,255,255,0.04)_100%)]"
          : "bg-[radial-gradient(61.35%_50.07%_at_48.58%_50%,rgb(255,255,255)_0%,rgba(0,0,0,0.02)_100%)]",
        // Shadows
        isDark
          ? "[box-shadow:inset_0_0_0_0.5px_rgba(134,143,151,0.2),inset_1px_1px_0_-0.5px_rgba(134,143,151,0.4),inset_-1px_-1px_0_-0.5px_rgba(134,143,151,0.4)]"
          : "[box-shadow:inset_0_0_0_0.5px_hsl(var(--border)),inset_1px_1px_0_-0.5px_hsl(var(--border)),inset_-1px_-1px_0_-0.5px_hsl(var(--border))]",
        // Hover effect pseudo-element
        "after:absolute after:inset-0 after:rounded-[28px] after:opacity-0 after:transition-opacity after:duration-200",
        // Hover gradient
        isDark
          ? "after:bg-[radial-gradient(61.35%_50.07%_at_48.58%_50%,rgb(0,0,0)_0%,rgb(24,24,24)_100%)]"
          : "after:bg-[radial-gradient(61.35%_50.07%_at_48.58%_50%,rgb(255,255,255)_0%,rgb(242,242,242)_100%)]",
        // Hover shadows
        isDark
          ? "after:[box-shadow:inset_0_0_0_0.5px_hsl(var(--border)),inset_1px_1px_0_-0.5px_hsl(var(--border)),inset_-1px_-1px_0_-0.5px_hsl(var(--border)),0_0_3px_rgba(255,255,255,0.1)]"
          : "after:[box-shadow:inset_0_0_0_0.5px_hsl(var(--border)),inset_1px_1px_0_-0.5px_hsl(var(--border)),inset_-1px_-1px_0_-0.5px_hsl(var(--border)),0_0_3px_hsl(var(--ring))]",
        "hover:after:opacity-100",
        // Disabled state
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-1">
        <LockIcon />
        {children}
      </span>
    </button>
  )
}

const buttonVariants = cva(
    'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                default:
                    'bg-primary text-primary-foreground shadow-sm shadow-black/5 hover:bg-primary/90',
                destructive:
                    'bg-destructive text-destructive-foreground shadow-sm shadow-black/5 hover:bg-destructive/90',
                outline:
                    'border border-input bg-background shadow-sm shadow-black/5 hover:bg-accent hover:text-accent-foreground',
                secondary:
                    'bg-secondary text-secondary-foreground shadow-sm shadow-black/5 hover:bg-secondary/80',
                ghost: 'hover:bg-accent hover:text-accent-foreground',
                link: 'text-primary underline-offset-4 hover:underline'
            },
            size: {
                default: 'h-9 px-4 py-2',
                sm: 'h-8 rounded-lg px-3 text-xs',
                lg: 'h-10 rounded-lg px-8',
                icon: 'h-9 w-9'
            }
        },
        defaultVariants: {
            variant: 'default',
            size: 'default'
        }
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button'
        return (
            <Comp className={buttonVariants({ variant, size, className })} ref={ref} {...props} />
        )
    }
)

Button.displayName = 'Button'

export { buttonVariants }
