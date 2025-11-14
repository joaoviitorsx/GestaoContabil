export interface CheckboxProps{
    Checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    className?: string;
}