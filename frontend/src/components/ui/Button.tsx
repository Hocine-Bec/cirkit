import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                disabled={isLoading || disabled}
                className={cn(
                    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95',
                    // Variants
                    variant === 'primary' && 'bg-accent text-white hover:bg-accent/90 glow-blue-hover',
                    variant === 'secondary' && 'glass border border-border text-text-primary hover:border-border-hover',
                    variant === 'ghost' && 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-hover',
                    variant === 'danger' && 'bg-danger text-white hover:bg-danger/90',
                    // Sizes
                    size === 'sm' && 'text-sm px-3 py-1.5 gap-1.5',
                    size === 'md' && 'text-sm px-4 py-2.5 gap-2',
                    size === 'lg' && 'text-base px-6 py-3 gap-2.5',
                    className
                )}
                {...props}
            >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {children}
            </button>
        );
    }
);
Button.displayName = 'Button';
export default Button;
