import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { adminOrdersApi } from '@/services/api';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import type { OrderResponse } from '@/types';

export default function OrderStatusActions({ order, onComplete }: { order: OrderResponse, onComplete: () => void }) {
    const queryClient = useQueryClient();
    const [confirmState, setConfirmState] = useState<{
        isOpen: boolean;
        action: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Refunded' | null;
    }>({ isOpen: false, action: null });

    const updateStatusMutation = useMutation({
        mutationFn: ({ status }: { status: string }) => adminOrdersApi.updateStatus(order.id, { status }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
            toast.success(`Order marked as ${variables.status}`);
            setConfirmState({ isOpen: false, action: null });
            if (onComplete) onComplete();
        },
        onError: (err: any) => toast.error(err.response?.data?.detail || 'Failed to update order status'),
    });

    const refundMutation = useMutation({
        mutationFn: () => adminOrdersApi.refund(order.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
            toast.success('Order successfully refunded');
            setConfirmState({ isOpen: false, action: null });
            if (onComplete) onComplete();
        },
        onError: (err: any) => toast.error(err.response?.data?.detail || 'Failed to process refund'),
    });

    const handleConfirm = () => {
        if (!confirmState.action) return;
        if (confirmState.action === 'Refunded') {
            refundMutation.mutate();
        } else {
            updateStatusMutation.mutate({ status: confirmState.action });
        }
    };

    const isTerminal = order.status === 'Cancelled' || order.status === 'Refunded' || order.status === 'Delivered';
    const isPending = order.status === 'Pending';
    const isProcessing = order.status === 'Processing';
    const isShipped = order.status === 'Shipped';
    // Can be refunded if it's processing, shipped, or delivered (but UI rules might restrict. Let's say all 3)
    const canRefund = (isProcessing || isShipped || order.status === 'Delivered') && order.status !== 'Refunded';

    const isMutating = updateStatusMutation.isPending || refundMutation.isPending;

    return (
        <>
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border mt-4">
                {isPending && (
                    <Button
                        variant="primary"
                        onClick={() => setConfirmState({ isOpen: true, action: 'Processing' })}
                        disabled={isMutating}
                    >
                        Mark Processing
                    </Button>
                )}
                {isProcessing && (
                    <Button
                        variant="primary"
                        onClick={() => setConfirmState({ isOpen: true, action: 'Shipped' })}
                        disabled={isMutating}
                    >
                        Mark Shipped
                    </Button>
                )}
                {isShipped && (
                    <Button
                        variant="primary"
                        onClick={() => setConfirmState({ isOpen: true, action: 'Delivered' })}
                        disabled={isMutating}
                        className="!bg-success hover:!bg-success/90 !text-black !shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                    >
                        Mark Delivered
                    </Button>
                )}

                {/* Separator if we have main actions left, cancel/refund right */}
                <div className="flex-1" />

                {!isTerminal && (
                    <Button
                        variant="ghost"
                        className="text-danger hover:text-danger hover:bg-danger/10"
                        onClick={() => setConfirmState({ isOpen: true, action: 'Cancelled' })}
                        disabled={isMutating}
                    >
                        Cancel Order
                    </Button>
                )}

                {canRefund && (
                    <Button
                        variant="danger"
                        onClick={() => setConfirmState({ isOpen: true, action: 'Refunded' })}
                        disabled={isMutating}
                    >
                        Issue Refund
                    </Button>
                )}
            </div>

            <ConfirmDialog
                isOpen={confirmState.isOpen}
                onClose={() => setConfirmState({ isOpen: false, action: null })}
                onConfirm={handleConfirm}
                title={`Confirm ${confirmState.action}`}
                description={
                    confirmState.action === 'Refunded'
                        ? `Are you sure you want to refund Order #${order.orderNumber}? This will reverse the payment of $${order.total.toFixed(2)}.`
                        : `Are you sure you want to mark Order #${order.orderNumber} as ${confirmState.action}?`
                }
                variant={confirmState.action === 'Cancelled' || confirmState.action === 'Refunded' ? 'danger' : 'primary'}
                confirmText={confirmState.action === 'Refunded' ? 'Process Refund' : `Mark ${confirmState.action}`}
                isLoading={isMutating}
            />
        </>
    );
}
