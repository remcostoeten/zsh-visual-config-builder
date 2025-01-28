export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

type UniqueBadgeProps = {
  text: string;
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export default function UniqueBadge({
  text,
  textColor = "text-white/70",
  backgroundColor = "bg-[#ff6c00]/10 ",
  borderColor = "border-[#ff6c00]/20",
  size = "md",
  className,
}: UniqueBadgeProps) {
  const sizeClasses = {
    sm: "px-1 text-xs",
    md: "px-[0.1875rem] text-[0.625rem]/[0.875rem]",
    lg: "px-2 text-sm",
  };

  const darkModeClasses = {
    textColor: textColor.replace("text-", "dark:text-").replace("-500", "-400"),
    backgroundColor: backgroundColor
      .replace("bg-", "dark:bg-")
      .replace("-50", "-950"),
    borderColor: borderColor
      .replace("text-", "dark:text-")
      .replace("-200", "-900"),
  };

  return (
    <span
      className={cn(
        `relative ${backgroundColor} ${sizeClasses[size]} font-medium ${textColor} ${darkModeClasses.backgroundColor}`,
        className // Merge additional classes
      )}
    >
      {text}
      {["top", "bottom", "left", "right"].map((side) => (
        <BorderSide
          key={side}
          side={side}
          borderColor={borderColor}
          darkBorderColor={darkModeClasses.borderColor}
        />
      ))}
    </span>
  );
}

type BorderSideProps = {
  side: "top" | "bottom" | "left" | "right";
  borderColor: string;
  darkBorderColor: string;
};

function BorderSide({ side, borderColor, darkBorderColor }: BorderSideProps) {
  const isVertical = side === "left" || side === "right";
  const positionClass = {
    top: "inset-x-[-0.1875rem] -top-px",
    bottom: "inset-x-[-0.1875rem] -bottom-px",
    left: "inset-y-[-0.1875rem] -left-px",
    right: "inset-y-[-0.1875rem] -right-px",
  }[side];

  return (
    <span
      className={`absolute ${positionClass} block transform-gpu ${borderColor} ${darkBorderColor}`}
    >
      <svg
        width={isVertical ? "1" : "100%"}
        height={isVertical ? "100%" : "1"}
        stroke="currentColor"
        strokeDasharray="3.3 1"
        aria-hidden="true"
      >
        <line
          x1={isVertical ? "0.5" : "0"}
          y1={isVertical ? "0" : "0.5"}
          x2={isVertical ? "0.5" : "100%"}
          y2={isVertical ? "100%" : "0.5"}
        />
      </svg>
    </span>
  );
}
