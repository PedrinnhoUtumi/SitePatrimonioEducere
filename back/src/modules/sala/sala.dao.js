import { supabase } from '../../infra/bd.js'

export default class SalasDao {
    constructor() {
        this.table = 'sala'
    }

    async findAll() {
        const { data, error } = await supabase
            .from(this.table)
            .select('*')

        if (error) throw error;
        return data;
    }

    async addSala(body) {
        const insertObj = {};
        Object.keys(body).forEach((k) => {
            if (body[k] !== undefined) insertObj[k] = body[k];
        });

        const { data, error } = await supabase
            .from(this.table)
            .insert([insertObj])
            .select()
            .maybeSingle();

        if (error) throw error;
        return data;
    }

    async deleteSala(id) {
        const { data, error } = await supabase
            .from(this.table)
            .delete()
            .eq('id_sala', id)        
            .select('id_sala')

        if (error) {
            console.error('Erro ao deletar sala:', error);
            return false;
        }

        return data && data.length > 0;
    }

    async deleteReservasDaSala(id) {
        const { error } = await supabase
            .from("salas_reservadas")
            .delete()
            .eq("id_sala", id);

        if (error) {
            console.error("Erro ao deletar reservas da sala:", error);
            return false;
        }

        return true;
    }

}