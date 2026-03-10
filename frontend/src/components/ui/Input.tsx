import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, id, ...props }, ref) => {
        return (
            <div className="space-y-1.5">
                {label && (
                    <label htmlFor={id} className="block text-sm font-medium text-text-secondary">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={id}
                    className={cn(
                        'w-full px-4 py-2.5 bg-bg-secondary border rounded-lg text-text-primary placeholder:text-text-muted text-sm transition-colors duration-200',
                        'focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30',
                        error ? 'border-danger' : 'border-border',
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p className="text-xs text-danger mt-1">{error}</p>
                )}
            </div>
        );
    }
);
Input.displayName = 'Input';
export default Input;
