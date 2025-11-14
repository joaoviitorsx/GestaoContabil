import type { InputProps } from '../types/components/input';

function Input({label, icon, type = 'text', placeholder = '', className= '', ...props}: InputProps) {
  return(
      <div>
        {label && (<label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>)}
        <div className="relative">
          {icon && <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">{icon}</span>}
          <input
            type={type}
            placeholder={placeholder}
            className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 
            ${icon ? 'pl-10' : 'pl-3'} ${className}`}
            {...props}
            />
        </div>
      </div>
  );
}
export default Input;
