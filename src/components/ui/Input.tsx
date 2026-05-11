import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'w-full rounded-lg border border-beige-300 bg-white px-3 py-2 text-sm placeholder:text-beige-400 focus:outline-none focus:ring-2 focus:ring-warm-500',
        className
      )}
      {...props}
    />
  );
}