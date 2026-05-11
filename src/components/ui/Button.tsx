import { cn } from '../../lib/utils'; // سننشئ utils صغير

// يمكنك استبدالها بمكون shadcn/ui الحقيقي لاحقًا
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
  size?: 'default' | 'lg';
}

const variants = {
  default: 'bg-warm-500 text-black hover:bg-warm-400',
  outline: 'border border-warm-500 text-warm-700 hover:bg-warm-500 hover:text-white',
};

const sizes = {
  default: 'px-4 py-2 text-sm',
  lg: 'px-8 py-3 text-base',
};

export default function Button({ className, variant = 'default', size = 'default', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-lg font-medium transition-colors',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}