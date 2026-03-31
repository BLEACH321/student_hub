import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface NeuCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'light' | 'inset' | 'sm';
  animate?: boolean;
  delay?: number;
}

export function NeuCard({
  children,
  className = '',
  onClick,
  variant = 'light',
  animate = true,
  delay = 0,
}: NeuCardProps) {
  const shadowClass = `neu-shadow-${variant}`;

  const content = (
    <div
      onClick={onClick}
      className={`bg-card rounded-3xl ${shadowClass} ${onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''} ${className}`}
    >
      {children}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}
