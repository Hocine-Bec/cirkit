import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { accountApi } from '@/services/api';
import AddressCard from '@/components/account/AddressCard';
import AddressForm from '@/components/account/AddressForm';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import Modal from '@/components/ui/Modal';
import type { AddressResponse, AddressRequest } from '@/types';

export default function AddressesPage() {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<AddressResponse | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState<AddressResponse | null>(null);

    const { data: addresses, isLoading, error } = useQuery({
        queryKey: ['my-addresses'],
        queryFn: accountApi.getAddresses,
    });

    const createMutation = useMutation({
        mutationFn: accountApi.addAddress,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-addresses'] });
            toast.success('Address added');
            setIsModalOpen(false);
        },
        onError: (err: any) => toast.error(err.response?.data?.detail || 'Failed to add address'),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: AddressRequest }) =>
            accountApi.updateAddress(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-addresses'] });
            toast.success('Address updated');
            setIsModalOpen(false);
        },
        onError: (err: any) => toast.error(err.response?.data?.detail || 'Failed to update address'),
    });

    const deleteMutation = useMutation({
        mutationFn: accountApi.deleteAddress,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-addresses'] });
            toast.success('Address deleted');
            setIsDeleteModalOpen(false);
        },
        onError: (err: any) => toast.error(err.response?.data?.detail || 'Failed to delete address'),
    });

    const handleOpenModal = (address: AddressResponse | null = null) => {
        setEditingAddress(address);
        setIsModalOpen(true);
    };

    const handleSubmit = async (data: AddressRequest) => {
        if (editingAddress) {
            await updateMutation.mutateAsync({ id: editingAddress.id, data });
        } else {
            await createMutation.mutateAsync(data);
        }
    };

    const confirmDelete = async () => {
        if (addressToDelete) {
            await deleteMutation.mutateAsync(addressToDelete.id);
        }
    };

    if (isLoading) {
        return (
            <div className="grid md:grid-cols-2 gap-4">
                {[...Array(2)].map((_, i) => (
                    <Skeleton key={i} className="h-40 w-full rounded-xl" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-center border border-danger/20 bg-danger/5 rounded-xl">
                <p className="text-danger">Failed to load addresses.</p>
            </div>
        );
    }

    const isSaving = createMutation.isPending || updateMutation.isPending;

    return (
        <div>
            <div className="flex justify-end mb-6">
                <Button variant="secondary" onClick={() => handleOpenModal()} className="gap-2">
                    <Plus className="w-4 h-4" /> Add New Address
                </Button>
            </div>

            {!addresses || addresses.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center bg-bg-secondary/30 border border-border rounded-xl border-dashed">
                    <MapPin className="w-16 h-16 text-text-muted mb-4" />
                    <h2 className="text-lg font-semibold text-text-primary mb-2">No addresses saved</h2>
                    <p className="text-sm text-text-secondary mb-6 max-w-sm">
                        Save shipping addresses to breeze through checkout.
                    </p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {addresses.map(address => (
                        <AddressCard
                            key={address.id}
                            address={address}
                            onEdit={handleOpenModal}
                            onDelete={(addr) => {
                                setAddressToDelete(addr);
                                setIsDeleteModalOpen(true);
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingAddress ? 'Edit Address' : 'Add New Address'}
            >
                <AddressForm
                    address={editingAddress}
                    onSubmit={handleSubmit}
                    isSubmitting={isSaving}
                />
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Address"
            >
                <div className="space-y-4">
                    <p className="text-text-secondary">
                        Are you sure you want to delete this address? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={confirmDelete}
                            isLoading={deleteMutation.isPending}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
