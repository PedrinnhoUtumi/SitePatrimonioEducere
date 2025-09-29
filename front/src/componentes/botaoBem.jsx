import { useState } from "react";
import { motion } from "framer-motion";

export default function BotaoBem({ onSelect }) {
    const [selected, setSelected] = useState("Meus Bens");

    const user = JSON.parse(localStorage.getItem("user"));
    const userType = user?.type || "Visualizador";

    const buttons = userType === "Administrador"
        ? [
            { label: "Meus Bens", value: "Meus Bens" },
            { label: "Adicionar", value: "Adicionar" }
        ]
        : [
            { label: "Meus Bens", value: "Meus Bens" }
        ];

    const handleClick = (value) => {
        setSelected(value);
        if (onSelect) onSelect(value);
    };

    return (
        <div className="relative m-4 w-full max-w-sm bg-gray-400 p-1 rounded-full shadow-[inset_0_0_10px_rgba(0,0,0,0.60)] flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
            {buttons.map((btn) => {
                const isActive = selected === btn.value;

                return (
                    <button
                        key={btn.value}
                        onClick={() => handleClick(btn.value)}
                        aria-pressed={isActive}
                        className="relative flex-1 h-12 rounded-full flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition"
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activeBackground"
                                className="absolute inset-0 bg-gray-900 rounded-full shadow-lg"
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            />
                        )}
                        <span
                            className={`relative z-10 font-semibold transition ${
                                isActive
                                    ? "bg-gradient-to-r from-blue-900 to-blue-400 text-transparent bg-clip-text drop-shadow-[0_0_8px_rgba(59,130,246,0.9)]"
                                    : "text-gray-100"
                            }`}
                        >
                            {btn.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
