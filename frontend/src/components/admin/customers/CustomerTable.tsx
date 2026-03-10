import { Eye } from 'lucide-react';
import type { CustomerResponse } from '@/types';

interface CustomerTableProps {
    customers: CustomerResponse[];
    onViewCustomer: (customer: CustomerResponse) => void;
}

export default function CustomerTable({ customers, onViewCustomer }: CustomerTableProps) {
    return (
        <div className="w-full overflow-x-auto rounded-xl border border-border bg-bg-secondary/60">
            <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-bg-tertiary/50 text-xs uppercase tracking-wider text-text-muted border-b border-border">
                    <tr>
                        <th className="px-6 py-4 font-medium">Name</th>
                        <th className="px-6 py-4 font-medium">Email</th>
                        <th className="px-6 py-4 font-medium">Orders</th>
                        <th className="px-6 py-4 font-medium text-right">Total Spent</th>
                        <th className="px-6 py-4 font-medium">Joined</th>
                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm">
                    {customers.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-6 py-8 text-center text-text-muted">
                                No customers found.
                            </td>
                        </tr>
                    ) : (
                        customers.map((customer) => (
                            <tr key={customer.id} className="hover:bg-bg-hover transition-colors bg-bg-primary/40">
                                <td className="px-6 py-4 font-medium text-text-primary">
                                    {customer.firstName} {customer.lastName}
                                </td>
                                <td className="px-6 py-4 text-text-secondary">
                                    <a href={`mailto:${customer.email}`} className="hover:text-accent hover:underline">
                                        {customer.email}
                                    </a>
                                </td>
                                <td className="px-6 py-4 font-mono text-text-secondary">
                                    {customer.orderCount}
                                </td>
                                <td className="px-6 py-4 font-mono font-medium text-text-primary text-right">
                                    ${customer.totalSpent.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-text-secondary">
                                    {new Date(customer.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => onViewCustomer(customer)}
                                        className="p-1.5 rounded-md text-text-muted hover:text-accent hover:bg-accent/10 transition-colors cursor-pointer inline-flex"
                                        title="View Customer Details"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
