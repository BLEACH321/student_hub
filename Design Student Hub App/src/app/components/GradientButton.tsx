import { motion } from 'motion/react';
import { ReactNode, ButtonHTMLAttributes } from 'react';

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'success' | 'purple';
  icon?: ReactNode;
  fullWidth?: boolean;
}

export function GradientButton({
  children,
  variant = 'primary',
  icon,
  fullWidth = false,
  className = '',
  ...props
}: GradientButtonProps) {
  const gradients = {
    primary: 'from-primary to-secondary',
    success: 'from-green-500 to-emerald-500',
    purple: 'from-purple-500 to-pink-500',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`py-4 px-6 bg-gradient-to-br ${gradients[variant]} text-white rounded-2xl neu-shadow-light hover:opacity-90 transition-opacity flex items-center justify-center gap-2 ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </motion.button>
  );
}
