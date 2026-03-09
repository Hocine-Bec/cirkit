import { cn } from '@/utils/cn';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export default function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
    return (
        <div
            className={cn(
                'animate-spin rounded-full border-2 border-border border-t-accent',
                size === 'sm' && 'w-4 h-4',
                size === 'md' && 'w-8 h-8',
                size === 'lg' && 'w-12 h-12',
                className
            )}
        />
    );
}
