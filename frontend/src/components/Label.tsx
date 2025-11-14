import type { LabelProps } from '../types/components/label';

function Label({ children, className = '', htmlFor = '', ...props }: LabelProps) {
    return (
        <label htmlFor={htmlFor} className={`${className}`} {...props}>
            {children}
        </label>
    );
}

export default Label;