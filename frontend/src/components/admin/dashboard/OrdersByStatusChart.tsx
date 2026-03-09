import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { OrdersByStatusResponse } from '@/types';

const COLORS: Record<string, string> = {
    Pending: '#F59E0B',     // warning
    Processing: '#3B82F6',  // accent
    Shipped: '#8B5CF6',     // accent-secondary
    Delivered: '#22C55E',   // success
    Cancelled: '#EF4444',   // danger
    Refunded: '#525252',    // muted
};

const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
}: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    if (percent < 0.05) return null; // Don't show label for tiny slices

    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

export default function OrdersByStatusChart({ data }: { data: OrdersByStatusResponse[] }) {
    const totalOrders = data.reduce((sum, item) => sum + item.count, 0);

    return (
        <div className="p-6 rounded-xl bg-bg-secondary/60 border border-border h-full flex flex-col">
            <h2 className="text-lg font-semibold text-text-primary mb-2">Orders by Status</h2>
            <div className="flex-1 min-h-[300px] relative mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="45%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="count"
                            nameKey="status"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            stroke="none"
                            animationBegin={200}
                            animationDuration={1000}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[entry.status] || '#525252'} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--color-bg-tertiary)',
                                backdropFilter: 'blur(8px)',
                                borderColor: 'var(--color-border)',
                                borderRadius: '0.75rem',
                                color: 'var(--color-text-primary)',
                            }}
                            itemStyle={{ color: 'white' }}
                            formatter={(value: any) => [value, 'Orders']}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            wrapperStyle={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                    <span className="text-2xl font-bold font-mono text-text-primary">{totalOrders}</span>
                    <span className="text-xs text-text-muted">Total</span>
                </div>
            </div>
        </div>
    );
}
