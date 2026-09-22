import React, { useState, useRef, useEffect } from "react";

export interface TariffFromDB {
    tariff_id: number;
    title: string;
    is_flexible: boolean;
    default_duration: number;
    base_price?: number;
    weekend_price?: number;
}

interface TariffDropdownProps {
    tariffs: TariffFromDB[];
    selectedTariffTitle: string;
    onSelect: (tariff: TariffFromDB) => void;
}

export const TariffDropdown: React.FC<TariffDropdownProps> = ({
    tariffs,
    selectedTariffTitle,
    onSelect
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className="relative w-full max-w-62.5 font-sans">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full h-11 px-5 flex items-center justify-between rounded-2xl bg-[#313131] backdrop-blur-md border transition-all duration-300 text-left cursor-pointer select-none
                    ${isOpen
                        ? "border-accent/50 shadow-[0_0_20px_rgba(224,254,16,0.15)] text-white"
                        : "border-white/10 text-white/80 hover:border-white/20"
                    }`}
            >
                <span className="text-[16px] font-normal">{selectedTariffTitle}</span>

                <svg
                    className={`w-5 h-5 text-white/50 transition-transform duration-300 ${isOpen ? "rotate-180 text-accent" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <div
                className={`absolute left-0 right-0 mt-2 rounded-2xl bg-[#1a1a1a]/95 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl overflow-hidden z-50 transition-all duration-300 origin-top
                    ${isOpen
                        ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                    }`}
            >
                <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                    {tariffs.map((t) => (
                        <div
                            key={t.tariff_id}
                            onClick={() => {
                                onSelect(t);
                                setIsOpen(false);
                            }}
                            className={`px-4 py-2 text-[15px] rounded-[10px] text-white/70 hover:text-black hover:bg-accent transition-colors duration-200 cursor-pointer select-none
                                ${selectedTariffTitle === t.title ? "bg-[#313131] text-accent font-medium" : ""}`}
                        >
                            {t.title}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};