export type Tab = {
    label: string;
    value: string;
    content ?: React.ReactNode;
    icon ?: React.ReactNode;
};

export type TabsProps = {
    tabs: Tab[];
    defaultValue ?: string;
    className ?: string;
};