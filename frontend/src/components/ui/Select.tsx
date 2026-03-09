import { type SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
    placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, id, options, placeholder, ...props }, ref) => {
        return (
            <div className="space-y-1.5">
                {label && (
                    <label htmlFor={id} className="block text-sm font-medium text-text-secondary">
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    id={id}
                    className={cn(
                        'w-full px-4 py-2.5 bg-bg-secondary border rounded-lg text-text-primary text-sm transition-colors duration-200 appearance-none cursor-pointer',
                        'focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30',
                        error ? 'border-danger' : 'border-border',
                        className
                    )}
                    {...props}
                >
                    {placeholder && (
                        <option value="" className="text-text-muted">{placeholder}</option>
                    )}
                    {options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                {error && (
                    <p className="text-xs text-danger mt-1">{error}</p>
                )}
            </div>
        );
    }
);
Select.displayName = 'Select';
export default Select;
