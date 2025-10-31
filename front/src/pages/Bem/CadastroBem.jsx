import { useState } from "react"
import { BotaoBem } from "../../componentes/Bem/botaoBem"
import { AdicionaBem } from "../../componentes/Bem/adicionaBem"
import { VerificaBem } from "../../componentes/Bem/verificaBem"
import { Pagina } from "../../componentes/Layout/Pagina"
export function CadastroBem() {
    const [selected, setSelected] = useState("Meus Bens")

    return (
        <Pagina>
            <div className="w-full flex flex-col items-center">
                <BotaoBem onSelect={setSelected} />

                {selected === "Meus Bens" && <VerificaBem />}
                {selected === "Adicionar" && <AdicionaBem />}

            </div>
        </Pagina>
    )
}
