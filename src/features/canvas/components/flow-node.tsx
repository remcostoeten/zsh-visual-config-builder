import { ReactNode } from "react"
import AnimatedNode from "../../../components/animated-node"

interface FlowNodeProps {
  id: string
  parent?: string
  icon?: ReactNode
  label: string
  metadata?: string
  variant?: "default" | "highlight" | "source"
  color?: "purple" | "blue" | "green" | "red" | "orange" | "yellow"
  shape?: "square" | "rectangle" | "rounded"
  fill?: string
  allNodes?: Array<{ id: string; parent?: string; label: string }>
  code?: string
  language?: string
};

export function FlowNode({
  id,
  parent,
  icon,
  label,
  metadata,
  variant = "default",
  color = "blue",
  shape = "rounded",
  fill,
  allNodes = [],
}: FlowNodeProps): JSX.Element {
  // Find children and parent nodes
  const children = allNodes.filter(node => node.parent === id);
  const parentNode = allNodes.find(node => node.id === parent);

  const colorMap = {
    purple: '#9333ea',
    blue: '#3b82f6',
    green: '#10b981',
    red: '#ef4444',
    orange: '#f97316',
    yellow: '#eab308'
  };

  const shapeStyles = {
    square: "w-[100px] h-[100px]",
    rectangle: "w-[140px] min-h-[80px]",
    rounded: "w-[120px] min-h-[100px]"
  }

  const colorStyles = {
    purple: { tooltip: "bg-purple-900/90 border-purple-800" },
    blue: { tooltip: "bg-blue-900/90 border-blue-800" },
    green: { tooltip: "bg-emerald-900/90 border-emerald-800" },
    red: { tooltip: "bg-red-900/90 border-red-800" },
    orange: { tooltip: "bg-orange-900/90 border-orange-800" },
    yellow: { tooltip: "bg-yellow-900/90 border-yellow-800" }
  };

  return (
    <div className="group relative">
      <AnimatedNode color={fill || colorMap[color]} className={shapeStyles[shape]}>
        <div className="flex flex-col items-center">
          {metadata && (
            <span className="text-xs text-zinc-500 dark:text-zinc-400 mb-2.5">
              {metadata}
            </span>
          )}
          <div className="flex flex-col items-center gap-3.5 flex-1 justify-center">
            {icon && (
              <div className="text-zinc-400 dark:text-zinc-300 w-6 h-6 flex items-center justify-center">
                {icon}
              </div>
            )}
            <span className="text-xs leading-normal text-zinc-300 dark:text-zinc-200 text-center min-h-[2.5em] flex items-center">
              {label}
            </span>
          </div>
        </div>
      </AnimatedNode>

      {/* Relationship Tooltip */}
      <div className={[
        "absolute left-1/2 top-full mt-2 -translate-x-1/2 z-50",
        "opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100",
        "transition-all duration-200",
        "w-64 p-3 rounded-lg border",
        variant === "highlight" ? colorStyles[color].tooltip : "bg-zinc-900/90 border-zinc-800",
        "shadow-lg backdrop-blur-sm",
        "pointer-events-none"
      ].join(" ")}>
        <div className="space-y-2 text-xs">
          <div className="flex items-start gap-2">
            <span className="font-medium text-zinc-400 w-16">ID:</span>
            <span className="text-zinc-200 font-mono">{id}</span>
          </div>
          
          {parentNode && (
            <div className="flex items-start gap-2">
              <span className="font-medium text-zinc-400 w-16">Parent:</span>
              <span className="text-zinc-200">{parentNode.label}</span>
            </div>
          )}
          
          {children.length > 0 && (
            <div className="flex items-start gap-2">
              <span className="font-medium text-zinc-400 w-16">Children:</span>
              <div className="flex-1 flex flex-col gap-1">
                {children.map((child) => (
                  <span key={child.id} className="text-zinc-200">
                    {child.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}