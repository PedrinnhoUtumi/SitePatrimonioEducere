import { supabase } from '../../infra/bd.js'

export default class SalasReservadasDao {
    constructor() {
        this.table = "salas_reservadas"
    }

    async getSalas() {
        const { data, error } = await supabase
        .from(this.table)
        .select("*")

    if (error) throw error
        return data
    } 

    async findConflictingReservations(salaId, startISO, endISO) {
        const { data, error } = await supabase
        .from(this.table)
        .select("*")
        .eq("id_sala", salaId)
        .not("data_fim", "lte", startISO)   
        .not("data_inicio", "gte", endISO)   

    if (error) throw error
        return data
    }


    async addReserva(sala) {
        const conflitos = await this.findConflictingReservations(
            sala.id_sala,
            sala.data_inicio,
            sala.data_fim
    )

    if (conflitos && conflitos.length > 0) {
        return { erro: "Sala já ocupada nesse intervalo", conflitos }
    }

    const { data, error } = await supabase
        .from(this.table)
        .insert([sala])
        .select()

        if (error) throw error
            return data
    }
}
