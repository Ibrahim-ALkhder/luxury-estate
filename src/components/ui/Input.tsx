import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'w-full rounded-xl bg-card border border-white/10 px-4 py-3 text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-300',
        className
      )}
      {...props}
    />
  );
}
