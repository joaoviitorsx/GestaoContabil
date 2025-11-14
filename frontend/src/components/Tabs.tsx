import { motion } from "framer-motion";
import type { TabsProps } from "../types/components/tabs";
import { useState } from "react";

function Tabs({ tabs, defaultValue, className, onChange }: TabsProps & { onChange?: (value: string) => void }) {
    const [active, setActive] = useState<string>(defaultValue || tabs[0].value);

    const handleTabClick = (value: string) => {
        setActive(value);
        onChange?.(value);
    };

    return (
        <div className={`w-full space-y-4 ${className || ""} `}>
            <div className="relative flex flex-wrap gap-2 bg-muted/60 p-1.5 rounded-full bg-gray-200 w-70">
            {tabs.map((tab) => {
                const isActive = active === tab.value;
                return (
                <button
                    key={tab.value}
                    onClick={() => handleTabClick(tab.value)}
                    type="button"
                    className={`relative flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer
                    ${isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}
                    `}>
                    {isActive && (<motion.span layoutId="tabHighlight" className="absolute inset-0 rounded-full bg-white shadow-sm" transition={{ type: "spring", stiffness: 300, damping: 40 }}/>)}
                    <span className="relative flex items-center gap-2">
                    {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
                    {tab.label}
                    </span>
                </button>
                );
            })}
            </div>
        </div>
    );
}

export default Tabs;
