import type { ReactNode } from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children : ReactNode;
    className ?: string;
    loading ?: boolean;
    variant ?: 'primary' | 'secondary';
}