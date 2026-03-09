import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import type { DailyRevenueResponse } from '@/types';

export default function RevenueChart({ data }: { data: DailyRevenueResponse[] }) {
    return (
        <div className="p-6 rounded-xl bg-bg-secondary/60 border border-border h-full flex flex-col">
            <h2 className="text-lg font-semibold text-text-primary mb-6">Revenue (30 days)</h2>
            <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="#737373"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => {
                                // Formatting to show every 5th label roughly or format nicely
                                const date = new Date(value);
                                return `${date.getMonth() + 1}/${date.getDate()}`;
                            }}
                            minTickGap={30}
                        />
                        <YAxis
                            stroke="#737373"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${value}`}
                            width={60}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--color-bg-tertiary)',
                                backdropFilter: 'blur(8px)',
                                borderColor: 'var(--color-border)',
                                borderRadius: '0.75rem',
                                color: 'var(--color-text-primary)',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                            }}
                            itemStyle={{ color: 'var(--color-accent)' }}
                            formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Revenue']}
                            labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', {
                                weekday: 'short', month: 'short', day: 'numeric',
                            })}
                        />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
