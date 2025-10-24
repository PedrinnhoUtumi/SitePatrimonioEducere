import { useState } from "react"
import { BotaoBem } from "../../componentes/Bem/botaoBem"
import { AdicionaBem } from "../../componentes/Bem/adicionaBem"
import { VerificaBem } from "../../componentes/Bem/verificaBem"

export function CadastroBem() {
    const [selected, setSelected] = useState("Meus Bens")

    return (
        <div className="flex flex-col min-h-screen justify-between items-center">
            <div className="w-full flex flex-col items-center">
                <BotaoBem onSelect={setSelected} />

                {selected === "Meus Bens" && <VerificaBem />}
                {selected === "Adicionar" && <AdicionaBem />}

            </div>
        </div>
    )
}
