import { useState } from "react"
import { BotaoSalas } from "../../../componentes/SalasReservadas/botaoSalas"
import { ReservaSala } from "../../../componentes/SalasReservadas/reservaSala"
import { SalasReservadasCalendar } from "../../../componentes/SalasReservadas/salasReservadas"

export function SalasReservadas() {
    const [selected, setSelected] = useState("Minhas Salas")
    const user = JSON.parse(localStorage.getItem("user"));
    const userTipo = user?.type || "Visualizador"

    return (
        <div className="flex flex-col min-h-screen justify-between items-center">
            <div className="flex flex-col justify-center items-center w-full">
                <BotaoSalas onSelect={setSelected} />

                {userTipo === "Administrador" && selected === "Adicionar" && <ReservaSala />}
                {selected === "Minhas Salas" && <SalasReservadasCalendar />}

            </div>
        </div>
    )
}
