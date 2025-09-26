import { supabase } from '../../infra/bd.js'

export default class HighlightDao{
    constructor(){
        this.table = 'sala'
    }
    
    async findAll(){
        const {data, error} = await supabase
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
}