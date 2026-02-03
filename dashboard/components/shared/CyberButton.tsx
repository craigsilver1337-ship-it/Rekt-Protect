'use client';

import { clsx } from 'clsx';

interface CyberButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}

const variants = {
  primary:
    'bg-cyber-green/10 border-cyber-green/40 text-cyber-green hover:bg-cyber-green/20 hover:border-cyber-green/60',
  secondary:
    'bg-cyber-blue/10 border-cyber-blue/40 text-cyber-blue hover:bg-cyber-blue/20 hover:border-cyber-blue/60',
  danger:
    'bg-cyber-red/10 border-cyber-red/40 text-cyber-red hover:bg-cyber-red/20 hover:border-cyber-red/60',
};

const sizes = {
  sm: 'px-3 py-1 text-xs',
  md: 'px-4 py-2 text-sm',
};

export default function CyberButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled,
  className,
  type = 'button',
}: CyberButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'border rounded font-mono font-medium transition-all duration-200',
        variants[variant],
        sizes[size],
        disabled && 'opacity-40 cursor-not-allowed',
        className,
      )}
    >
      {children}
    </button>
  );
}
