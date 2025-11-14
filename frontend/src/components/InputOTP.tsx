import { useRef } from "react";
import type { InputOTPProps } from "../types/components/inputOTP";

export default function InputOTP({ length = 6, value, onChange, className = "" }: InputOTPProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, newValue: string) => {
    const newCode =
      value.substring(0, index) +
      newValue.slice(-1) +
      value.substring(index + 1);

    onChange(newCode);

    // Foco no próximo input automaticamente
    if (newValue && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className={`flex justify-center gap-2 ${className}`}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { inputsRef.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="w-10 h-12 text-center border border-gray-300 rounded-md text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ))}
    </div>
  );
}
