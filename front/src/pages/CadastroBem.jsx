import { useState } from "react"
import Menu from "../componentes/menuTop"
import BotaoBem from "../componentes/botaoBem"
import AdcionaBem from "../componentes/adicionaBem"
import VerificaBem from "../componentes/verificaBem"
import Foot from "../componentes/Footer"

export default function CadastroBem() {
    const [selected, setSelected] = useState("Meus Bens")

    return (
        <div className="flex flex-col min-h-screen justify-between items-center">
            <div className="w-full flex flex-col items-center">
                <Menu />
                <BotaoBem onSelect={setSelected} />

                {selected === "Meus Bens" && <VerificaBem />}
                {selected === "Adicionar" && <AdcionaBem />}
                
            </div>
            <Foot/>
        </div>
    )
}
