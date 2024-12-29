import React from 'react';
import { motion } from 'framer-motion';

type GradientVariant = 'default' | 'blue' | 'green' | 'purple' | 'orange' | 'teal' | 'pink' | 'gray';
type ButtonShape = 'default' | 'pill' | 'sharp';

interface GradientButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  variant?: GradientVariant;
  shape?: ButtonShape;
  rotation?: number;
  startColor?: string;
  endColor?: string;
  hoverStartColor?: string;
  hoverEndColor?: string;
  duration?: number;
  bezier?: [number, number, number, number];
}

const defaultGradients: Record<GradientVariant, { start: string; end: string; hoverStart: string; hoverEnd: string }> = {
  default: { start: '#000', end: '#88394C', hoverStart: '#C96287', hoverEnd: '#000' },
  blue: { start: '#001F3F', end: '#39CCCC', hoverStart: '#7FDBFF', hoverEnd: '#0074D9' },
  green: { start: '#002E1F', end: '#39CC8F', hoverStart: '#7FFF7F', hoverEnd: '#00A86B' },
  purple: { start: '#2E0854', end: '#C77DFF', hoverStart: '#9D4EDD', hoverEnd: '#5B0FB4' },
  orange: { start: '#4D1D00', end: '#FDBA74', hoverStart: '#FB923C', hoverEnd: '#9A3412' },
  teal: { start: '#042F2E', end: '#5EEAD4', hoverStart: '#2DD4BF', hoverEnd: '#0F766E' },
  pink: { start: '#500724', end: '#FBCFE8', hoverStart: '#F472B6', hoverEnd: '#9D174D' },
  gray: { start: '#1F2937', end: '#D1D5DB', hoverStart: '#9CA3AF', hoverEnd: '#4B5563' },
};

const shapeStyles: Record<ButtonShape, string> = {
  default: 'rounded-[11px]',
  pill: 'rounded-full',
  sharp: 'rounded-none',
};

const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
  variant = 'default',
  shape = 'default',
  rotation = 140,
  startColor,
  endColor,
  hoverStartColor,
  hoverEndColor,
  duration = 0.5,
  bezier = [0.4, 0, 0.2, 1],
}) => {
  const gradientColors = defaultGradients[variant];
  const start = startColor || gradientColors.start;
  const end = endColor || gradientColors.end;
  const hoverStart = hoverStartColor || gradientColors.hoverStart;
  const hoverEnd = hoverEndColor || gradientColors.hoverEnd;

  const gradientStyle = {
    backgroundImage: `radial-gradient(150% 180.06% at 11.14% ${rotation}%, ${start} 37.35%, ${end} 100%)`,
  };

  const hoverGradientStyle = {
    backgroundImage: `radial-gradient(120.24% 103.18% at 0% 91.51%, ${hoverStart} 0%, ${hoverEnd} 85.76%)`,
  };

  return (
    <motion.button
      onClick={onClick}
      className={`
        relative border-none py-3 px-8 min-w-[120px] text-base leading-none
        font-medium font-inherit text-white cursor-pointer appearance-none
        shadow-[0_0_0_1px_inset_rgba(255,255,255,0.1)] outline-none
        ${shapeStyles[shape]}
        ${className}
      `}
      style={gradientStyle}
      whileHover={hoverGradientStyle}
      transition={{ duration, ease: bezier }}
      type={type}
      disabled={disabled}
      aria-disabled={disabled}
    >
      <span className="relative z-10 text-shadow-[0_0.5px_1px_rgba(0,0,0,0.75)]">
        {children}
      </span>
    </motion.button>
  );
};

export default GradientButton;

// Usage example
export const GradientButtonExample: React.FC = () => {
  return (
    <GradientButton
      onClick={() => console.log('Button clicked!')}
      variant="purple"
      shape="pill"
      rotation={120}
      startColor="#4A00E0"
      endColor="#8E2DE2"
      hoverStartColor="#8E2DE2"
      hoverEndColor="#4A00E0"
      duration={0.3}
      bezier={[0.4, 0, 0.2, 1]}
    >
      Click me!
    </GradientButton>
  );
};

