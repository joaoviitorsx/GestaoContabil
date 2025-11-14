import type { SwitchProps } from "../types/components/switch";
import { useState } from "react";

function Switch({ checked = false, onChange, disabled }: SwitchProps) {
  const [active, setActive] = useState(checked);

  const handleToggle = () => {
    if (disabled) return;
    setActive(!active);
    onChange?.(!active);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={disabled}
      type="button"
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${active ? "bg-blue-600" : "bg-gray-300"} 
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 active:scale-95`}
      tabIndex={0}>
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200
          ${active ? "translate-x-5" : "translate-x-1"}`}
      />
    </button>
  );
}

export default Switch;