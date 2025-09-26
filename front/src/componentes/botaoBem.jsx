import { useState } from "react"
import { motion } from "framer-motion"

export default function BotaoBem({ onSelect }) {
    const [selected, setSelected] = useState("Meus Bens")

    // pega usuário do localStorage
    const user = JSON.parse(localStorage.getItem("user"))
    const userType = user?.type || "Visualizador" // default se não tiver nada salvo

    const buttonsAdm = [
        { label: "Meus Bens", value: "Meus Bens" },
        { label: "Adicionar", value: "Adicionar" }
    ]

    const buttonsUser = [
        { label: "Meus Bens", value: "Meus Bens" }
    ]

    // escolhe qual array usar
    const buttons = userType === "Administrador" ? buttonsAdm : buttonsUser

    const handleClick = (value) => {
        setSelected(value)
        if (onSelect) onSelect(value) 
    }

    return (
        <div className="relative m-5 h-14 w-96 bg-gray-400 flex items-center p-1 rounded-full shadow-[inset_0_0_10px_rgba(0,0,0,0.60)] justify-between">
            {buttons.map((btn) => {
                const isActive = selected === btn.value

                return (
                    <button
                        key={btn.value}
                        onClick={() => handleClick(btn.value)}
                        className="relative flex-1 h-12 rounded-full flex items-center justify-center"
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activeBackground"
                                className="absolute inset-0 bg-gray-900 rounded-full shadow-lg"
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            />
                        )}

                        <span
                            className={`relative z-10 font-semibold ${
                                isActive
                                ? "bg-gradient-to-r from-blue-900 to-blue-400 text-transparent bg-clip-text drop-shadow-[0_0_8px_rgba(59,130,246,0.9)]"
                                : "text-gray-200"
                            }`}
                        >
                            {btn.label}
                        </span>
                    </button>
                )
            })}
        </div>
    )
}
