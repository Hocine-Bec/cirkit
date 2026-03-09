import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'primary' | 'warning';
    isLoading?: boolean;
}

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    isLoading = false,
}: ConfirmDialogProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="">
            <div className="flex flex-col items-center text-center p-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${variant === 'danger' ? 'bg-danger/10 text-danger' :
                        variant === 'warning' ? 'bg-warning/10 text-warning' :
                            'bg-accent/10 text-accent'
                    }`}>
                    <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2">{title}</h3>
                <p className="text-sm text-text-secondary mb-8">{description}</p>

                <div className="flex w-full gap-3">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="flex-1"
                        disabled={isLoading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={variant === 'primary' ? 'primary' : variant === 'warning' ? 'secondary' : 'danger'}
                        onClick={onConfirm}
                        className="flex-1"
                        isLoading={isLoading}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
