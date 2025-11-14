import { ChevronDown } from "lucide-react";
import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  helperText?: string;
  value?: string;
  onChange?: (value: string) => void;
  variant?: 'default' | 'outlined' | 'filled';
  customSize?: 'sm' | 'md' | 'lg';
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      placeholder = "Selecione uma opção",
      error,
      helperText,
      value,
      onChange,
      variant = 'default',
      customSize = 'md',
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'h-9 text-sm',
      md: 'h-10 text-base',
      lg: 'h-12 text-lg'
    } as const;

    const variantClasses = {
      default: 'bg-white border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-blue-500',
      outlined: 'bg-transparent border-2 border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring-blue-500',
      filled: 'bg-gray-100 border-transparent hover:bg-gray-200 focus:bg-white focus:border-blue-500 focus:ring-blue-500'
    };

    return (
      <div className={className}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        
        <div className="relative">
          <select ref={ref} value={value} onChange={(e) => onChange?.(e.target.value)} disabled={disabled}
            className={` w-full rounded-lg border px-3 pr-10 appearance-none cursor-pointer transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100
              ${sizeClasses[customSize]} ${variantClasses[variant]} ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} ${className} `}
            {...props}>
            <option value="" disabled hidden>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value} className="text-black-800">
                {option.label}
              </option>
            ))}
          </select>

          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <ChevronDown 
              className={`transition-colors ${
                disabled ? 'text-gray-400' : error ? 'text-red-500' : 'text-gray-500'
              }`}
              size={customSize === 'sm' ? 16 : customSize === 'lg' ? 20 : 18}
            />
          </div>
        </div>

        {(error || helperText) && (
          <p className={`mt-1.5 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;