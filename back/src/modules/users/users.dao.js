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

    async findByEmail(email) {
        const { data, error } = await supabase
        .from(this.table)
        .select('*')
        .eq('email', email)
        .maybeSingle(); 

        if (error) throw error;
        return data;    
    }
}
