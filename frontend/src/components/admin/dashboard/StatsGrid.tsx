import { useEffect, useState, useRef } from 'react';
import { useInView, animate } from 'framer-motion';
import { DollarSign, ShoppingCart, Users, Clock } from 'lucide-react';
import type { OverviewResponse } from '@/types';

interface CounterProps {
    value: number;
    isCurrency?: boolean;
}

function Counter({ value, isCurrency = false }: CounterProps) {
    const nodeRef = useRef<HTMLSpanElement>(null);
    const isInView = useInView(nodeRef, { once: true, margin: "-50px" });
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        if (isInView && nodeRef.current) {
            const controls = animate(0, value, {
                duration: 1.5,
                ease: 'easeOut',
                onUpdate(v) {
                    setDisplayValue(v);
                },
            });
            return controls.stop;
        }
    }, [isInView, value]);

    if (isCurrency) {
        return (
            <span ref={nodeRef} className="text-3xl font-bold font-mono tracking-tight text-text-primary">
                ${displayValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
        );
    }

    return (
        <span ref={nodeRef} className="text-3xl font-bold font-mono tracking-tight text-text-primary">
            {Math.round(displayValue).toLocaleString('en-US')}
        </span>
    );
}

export default function StatsGrid({ stats }: { stats: OverviewResponse }) {
    const cards = [
        {
            title: 'Total Revenue',
            value: stats.totalRevenue,
            isCurrency: true,
            icon: DollarSign,
            color: 'accent',
            borderColor: 'border-accent',
            bgColor: 'bg-accent/10',
            textColor: 'text-accent',
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders,
            icon: ShoppingCart,
            color: 'accent-secondary',
            borderColor: 'border-accent-secondary',
            bgColor: 'bg-[#8B5CF6]/10',
            textColor: 'text-[#8B5CF6]',
        },
        {
            title: 'Total Customers',
            value: stats.totalCustomers,
            icon: Users,
            color: 'success',
            borderColor: 'border-success',
            bgColor: 'bg-success/10',
            textColor: 'text-success',
        },
        {
            title: 'Pending Orders',
            value: stats.pendingOrders,
            icon: Clock,
            color: 'warning',
            borderColor: 'border-warning',
            bgColor: 'bg-warning/10',
            textColor: 'text-warning',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card) => (
                <div
                    key={card.title}
                    className={`relative overflow-hidden p-6 rounded-xl bg-bg-secondary/60 border border-border border-l-4 ${card.borderColor}`}
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${card.bgColor} ${card.textColor}`}>
                            <card.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-sm font-medium text-text-muted uppercase tracking-wider">
                            {card.title}
                        </h3>
                    </div>
                    <Counter value={card.value} isCurrency={card.isCurrency} />
                </div>
            ))}
        </div>
    );
}
