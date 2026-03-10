import { Check, XCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];

function getStepIndex(status: string): number {
    const idx = steps.indexOf(status);
    return idx >= 0 ? idx : -1;
}

export default function OrderStatusTimeline({ status }: { status: string }) {
    const isCancelled = status === 'Cancelled' || status === 'Refunded';
    const currentIndex = isCancelled ? -1 : getStepIndex(status);

    return (
        <div className="py-4">
            {/* Desktop horizontal */}
            <div className="hidden sm:flex items-center justify-between">
                {steps.map((step, i) => {
                    const isCompleted = !isCancelled && i < currentIndex;
                    const isCurrent = !isCancelled && i === currentIndex;

                    return (
                        <div key={step} className="flex items-center flex-1 last:flex-none">
                            <div className="flex flex-col items-center gap-1.5">
                                <div
                                    className={cn(
                                        'w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors',
                                        isCompleted && 'bg-accent border-accent',
                                        isCurrent && 'border-accent bg-accent/10',
                                        !isCompleted && !isCurrent && 'border-border bg-bg-tertiary'
                                    )}
                                >
                                    {isCompleted ? (
                                        <Check className="w-4 h-4 text-white" />
                                    ) : isCurrent ? (
                                        <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
                                    ) : null}
                                </div>
                                <span
                                    className={cn(
                                        'text-xs font-medium',
                                        isCompleted || isCurrent ? 'text-text-primary' : 'text-text-muted'
                                    )}
                                >
                                    {step}
                                </span>
                            </div>
                            {i < steps.length - 1 && (
                                <div
                                    className={cn(
                                        'flex-1 h-0.5 mx-2 mt-[-1.25rem]',
                                        isCompleted ? 'bg-accent' : 'bg-border'
                                    )}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Mobile vertical */}
            <div className="sm:hidden space-y-3">
                {steps.map((step, i) => {
                    const isCompleted = !isCancelled && i < currentIndex;
                    const isCurrent = !isCancelled && i === currentIndex;

                    return (
                        <div key={step} className="flex items-center gap-3">
                            <div
                                className={cn(
                                    'w-7 h-7 rounded-full flex items-center justify-center border-2 shrink-0',
                                    isCompleted && 'bg-accent border-accent',
                                    isCurrent && 'border-accent bg-accent/10',
                                    !isCompleted && !isCurrent && 'border-border bg-bg-tertiary'
                                )}
                            >
                                {isCompleted ? (
                                    <Check className="w-3.5 h-3.5 text-white" />
                                ) : isCurrent ? (
                                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                ) : null}
                            </div>
                            <span
                                className={cn(
                                    'text-sm font-medium',
                                    isCompleted || isCurrent ? 'text-text-primary' : 'text-text-muted'
                                )}
                            >
                                {step}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Cancelled / Refunded indicator */}
            {isCancelled && (
                <div className="mt-4 flex items-center gap-2 text-danger">
                    <XCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Order {status}</span>
                </div>
            )}
        </div>
    );
}
