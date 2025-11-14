export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    icon ?: React.ReactNode;
    title ?: string;
    children: React.ReactNode;
    footer ?: React.ReactNode;
    width ?: string;
}