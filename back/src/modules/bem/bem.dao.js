import { supabase } from '../../infra/bd.js'; // ajuste o caminho conforme seu projeto

export default class BemDao {
    constructor() {
        this.table = 'bem';
    }

    async getBens() {
        const { data, error } = await supabase
        .from(this.table)
        .select('*');

        if (error) throw error;
        return data;
    }

  // Retorna o maior idQrCode (número) ou 0 se não houver registros
    async getMaxIdQr() {
        const { data, error } = await supabase
        .from(this.table)
        .select('idQrCode')
        .order('idQrCode', { ascending: false })
        .limit(1)
        .maybeSingle(); // evita erro se não existir linha

        if (error) throw error;

        if (!data || data.idQrCode == null) return 0;
        return Number(data.idQrCode);
    }

  // Insere um bem. body: objeto com os campos (camelCase ou snake_case conforme seu schema)
    async addBem(body) {
        // filtra apenas propriedades undefined (permitindo explicitamente null)
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

    async deleteBem(id) {
        if (id === undefined || id === null) {
            throw new Error('id é obrigatório');
        }

        // usa .delete().select() para obter a(s) linha(s) deletada(s)
        const { data, error } = await supabase
            .from(this.table)
            .update({ status: false })
            .eq('id_bem', id)
            .select();

        if (error) throw error;
            return data;
    }

    async getUnicBem(id) {
        if (id === undefined || id === null) {
        const err = new Error('id é obrigatório');
        err.status = 400;
        throw err;
        }

        try {
        const { data, error } = await supabase
            .from(this.table)
            .select('*')
            .eq('id_bem', id)
            .maybeSingle();

        if (error) {
            // adiciona contexto e lança para o controller tratar
            const e = new Error(`Supabase error: ${error.message || JSON.stringify(error)}`);
            e.details = error;
            e.status = 500;
            throw e;
        }

        return data; // null se não encontrado
        } catch (err) {
        console.error('[bemDao] erro inesperado:', err);
        throw err; // re-lança pro controller
        }
    }

    async updateBem(id, updates) {
        if (id === undefined || id === null) {
            throw new Error('id é obrigatório');
        }
        if (!updates || Object.keys(updates).length === 0) {
            throw new Error('Nenhum campo para atualizar foi fornecido');
        }

        // Executa update no supabase e retorna as linhas atualizadas
        const { data, error } = await supabase
            .from(this.table)
            .update(updates)
            .eq('id_bem', id)
            .select();

        if (error) throw error;
            return data;
    }
}
