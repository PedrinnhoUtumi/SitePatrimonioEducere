class Bem {
    constructor( id_bem, categoria, descricao_do_bem, data_aquisicao, data_baixa, justificativa_baixa, depreciacao_percent, valor_aquisicao, valor_residual, marca, localizacao_text, id_sala, modelo, estado_conservacao, id_user_responsavel, created_at, updated_at, idQrCode ) {
        this.id_bem = id_bem;
        this.categoria = categoria;
        this.descricao_do_bem = descricao_do_bem;
        this.data_aquisicao = data_aquisicao;
        this.data_baixa = data_baixa;
        this.justificativa_baixa = justificativa_baixa;
        this.depreciacao_percent = depreciacao_percent;
        this.valor_aquisicao = valor_aquisicao;
        this.valor_residual = valor_residual;
        this.marca = marca;
        this.localizacao_text = localizacao_text;
        this.id_sala = id_sala;
        this.modelo = modelo;
        this.estado_conservacao = estado_conservacao;
        this.id_user_responsavel = id_user_responsavel;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.idQrCode = idQrCode
    }
}

module.exports = Bem;