import { supabase } from '../../infra/bd.js'; 

export default class UsersDao {
    constructor() {
        this.table = 'users';
    }

    async cadastrar(body) {
        const { data, error } = await supabase
        .from(this.table)
        .insert([body])
        .select(); 

        if (error) throw error;
        return data;
    }

    async atualizar(body, id) {
        const { data, error } = await supabase
        .from(this.table)
        .update([body])
        .eq('id_user', id)
        .select(); 

        if (error) throw error;
        return data[0];
    }

    async findByEmail(email) {
        const { data, error } = await supabase
        .from(this.table)
        .select('*')
        .eq('email', email)
        .maybeSingle(); 

        if (error) throw error;
        return data;    
    }
    
    async findAll() {
        const { data, error } = await supabase
            .from(this.table)
            .select('*')

        if (error) throw error;
        return data;
    }
    
    async deleteUsers(id) {
        const { data, error } = await supabase
            .from(this.table)
            .delete()
            .eq('id_user', id)        
            .select('id_user')

        if (error) {
            console.error('Erro ao deletar usuário:', error);
            return false;
        }

        return data && data.length > 0;
    }

}
