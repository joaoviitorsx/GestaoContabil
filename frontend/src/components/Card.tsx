import type { CardProps } from '../types/components/card';

function Card({ children, className = '' }: CardProps) {
    return (
        <div className={`p-6 m-4 shadow-lg rounded-lg bg-white w-full max-w-md h-auto shadow-gray-300 ${className}`}>
            {children}
        </div>
    );
}

export default Card;