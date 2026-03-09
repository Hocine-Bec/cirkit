import { Pencil, Trash2 } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import type { AddressResponse } from '@/types';

interface AddressCardProps {
    address: AddressResponse;
    onEdit: (address: AddressResponse) => void;
    onDelete: (address: AddressResponse) => void;
}

export default function AddressCard({ address, onEdit, onDelete }: AddressCardProps) {
    return (
        <div className="p-5 rounded-xl bg-bg-secondary/60 border border-border space-y-3">
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Badge variant={address.isDefault ? 'info' : 'default'}>
                        {address.label}
                    </Badge>
                    {address.isDefault && (
                        <span className="text-xs text-accent font-medium">Default</span>
                    )}
                </div>
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => onEdit(address)}
                        className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors cursor-pointer"
                        aria-label="Edit address"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(address)}
                        className="p-1.5 rounded-md text-text-muted hover:text-danger hover:bg-danger/5 transition-colors cursor-pointer"
                        aria-label="Delete address"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
            <div className="text-sm text-text-secondary leading-relaxed">
                <p>{address.street}</p>
                <p>{address.city}, {address.state} {address.zipCode}</p>
                <p>{address.country}</p>
            </div>
        </div>
    );
}
