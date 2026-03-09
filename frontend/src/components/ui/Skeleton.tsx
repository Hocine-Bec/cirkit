import { cn } from '@/utils/cn';

interface SkeletonProps {
    className?: string;
}

export default function Skeleton({ className }: SkeletonProps) {
    return (
        <div className={cn('bg-bg-tertiary animate-pulse rounded', className)} />
    );
}
