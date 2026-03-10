import { User, MapPin, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import type { CustomerDetailResponse } from '@/types';

interface CustomerDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    customer: (CustomerDetailResponse & { orderCount?: number; totalSpent?: number }) | null;
}

export default function CustomerDetailModal({ isOpen, onClose, customer }: CustomerDetailModalProps) {
    if (!customer) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Customer Profile"
        >
            <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
                {/* Header Profile Ribbon */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-bg-secondary/60 border border-border">
                    <div className="w-16 h-16 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0 border border-accent/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                        <User className="w-8 h-8" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-bold text-text-primary truncate">
                            {customer.firstName} {customer.lastName}
                        </h2>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-text-secondary">
                            <a href={`mailto:${customer.email}`} className="hover:text-accent hover:underline">
                                {customer.email}
                            </a>
                            {customer.phone && (
                                <>
                                    <span className="text-border">•</span>
                                    <span>{customer.phone}</span>
                                </>
                            )}
                        </div>
                        <p className="text-xs text-text-muted mt-2">
                            Customer since {new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                    <div className="hidden sm:block text-right shrink-0 pl-4 border-l border-border">
                        <p className="text-sm text-text-secondary">Lifetime Value</p>
                        <p className="text-2xl font-mono font-bold text-success">
                            ${customer.totalSpent?.toFixed(2) || '0.00'}
                        </p>
                        <p className="text-xs text-text-muted mt-1">{customer.orderCount || 0} Orders</p>
                    </div>
                </div>

                {/* Addresses */}
                <div>
                    <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-accent" /> Saved Addresses
                    </h3>

                    {customer.addresses.length === 0 ? (
                        <p className="text-sm text-text-muted italic p-4 bg-bg-secondary/30 rounded-xl border border-border border-dashed text-center">
                            No addresses saved.
                        </p>
                    ) : (
                        <div className="grid sm:grid-cols-2 gap-4">
                            {customer.addresses.map((addr) => (
                                <div key={addr.id} className="relative p-4 rounded-xl border border-border bg-bg-secondary/30 text-sm hover:border-accent/40 transition-colors">
                                    {addr.isDefault && (
                                        <Badge variant="info" className="absolute top-3 right-3 text-[10px] px-1.5 py-0.5">
                                            Default
                                        </Badge>
                                    )}
                                    <p className="font-medium text-text-primary pr-16">{addr.label}</p>
                                    <p className="text-text-secondary mt-1">{addr.street}</p>
                                    <p className="text-text-secondary">{addr.city}, {addr.state} {addr.zipCode}</p>
                                    <p className="text-text-secondary">{addr.country}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Orders Overview (Could add a table if data is passed, but specs just say basic info) */}
                <div>
                    <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-accent" /> Order History
                    </h3>

                    <div className="p-4 rounded-xl border border-border bg-bg-secondary/30 flex items-center justify-between">
                        <div className="text-sm text-text-secondary">
                            This customer has placed <strong className="text-text-primary">{customer.orderCount || 0}</strong> orders totaling <strong className="text-text-primary font-mono">${customer.totalSpent?.toFixed(2) || '0.00'}</strong>.
                        </div>

                        <Link
                            to={`/admin/orders?search=${customer.email}`}
                            onClick={onClose}
                            className="text-sm font-medium text-accent hover:text-accent-glow hover:underline shrink-0"
                        >
                            View Orders →
                        </Link>
                    </div>
                </div>

            </div>
        </Modal>
    );
}
