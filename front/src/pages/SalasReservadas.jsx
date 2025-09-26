import { useState } from "react"
import Menu from "../componentes/menuTop"
import BotaoSalas from "../componentes/botaoSalas"
import ReservaSala from "../componentes/reservaSala"
import SalasReservadas from "../componentes/salasReservadas"
import Foot from "../componentes/Footer"

export default function Salas() {
    const [selected, setSelected] = useState("Minhas Salas")
    const user = JSON.parse(localStorage.getItem("user"));
    const userTipo = user?.type || "Visualizador"

    return (
        <div className="flex flex-col min-h-screen justify-between items-center">
            <div className="flex flex-col justify-center items-center w-full">
                <Menu />
                <BotaoSalas onSelect={setSelected} />

                {userTipo === "Administrador" && selected === "Adicionar" && <ReservaSala />}
                {selected === "Minhas Salas" && <SalasReservadas />}

            </div>
            <Foot/>
        </div>
    )
}
