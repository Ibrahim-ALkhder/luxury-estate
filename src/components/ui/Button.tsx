import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'lg';
}

const variants = {
  default: 'bg-gold-500 text-[#1C1814] shadow-gold hover:shadow-gold-glow hover:bg-[#FFD95A] hover:scale-105',
  outline: 'border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-[#1C1814]',
  ghost: 'text-white/80 hover:text-gold-500',
};

const sizes = {
  default: 'px-4 py-2 text-sm',
  lg: 'px-8 py-3 text-base',
};

export default function Button({ className, variant = 'default', size = 'default', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-lg font-medium transition-all duration-300',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
