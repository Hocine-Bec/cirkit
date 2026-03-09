import { cn } from '@/utils/cn';

interface ToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    size?: 'sm' | 'md';
}

export default function Toggle({ checked, onChange, disabled = false, size = 'md' }: ToggleProps) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => onChange(!checked)}
            className={cn(
                'relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg-primary',
                checked ? 'bg-accent' : 'bg-bg-tertiary',
                disabled && 'opacity-50 cursor-not-allowed',
                size === 'sm' ? 'h-5 w-9' : 'h-6 w-11'
            )}
        >
            <span
                aria-hidden="true"
                className={cn(
                    'pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out',
                    size === 'sm' ? (checked ? 'translate-x-4 h-4 w-4' : 'translate-x-0 h-4 w-4') : (checked ? 'translate-x-5 h-5 w-5' : 'translate-x-0 h-5 w-5')
                )}
            />
        </button>
    );
}
