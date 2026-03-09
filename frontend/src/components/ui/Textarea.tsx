import { type TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, id, ...props }, ref) => {
        return (
            <div className="space-y-1.5">
                {label && (
                    <label htmlFor={id} className="block text-sm font-medium text-text-secondary">
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={id}
                    rows={4}
                    className={cn(
                        'w-full px-4 py-2.5 bg-bg-secondary border rounded-lg text-text-primary placeholder:text-text-muted text-sm transition-colors duration-200 resize-y',
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
Textarea.displayName = 'Textarea';
export default Textarea;
