import type { ButtonProps } from "../types/components/button";

function Button({ children, className = '', loading = false, variant= 'primary', disabled, ...props }: ButtonProps) {
    const base = "px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-150 focus:outline-none";
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500",
        secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-2 focus:ring-gray-500"
    }
    const isDisabled = disabled || loading;
    return (
        <button disabled={isDisabled} className={`${base} ${variants[variant]} ${isDisabled ? "opacity-70 cursor-not-allowed" : ""} ${className}`}{...props}>
            {loading ? "Carregando..." : children}
        </button>
    );
}

export default Button;