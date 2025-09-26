class SalaReservada {
    constructor( id_reserva, id_sala, responsavel_id, data_inicio, data_fim, descricao, created_at, updated_at ) {
        this.id_reserva = id_reserva;
        this.id_sala = id_sala;
        this.responsavel_id = responsavel_id;
        this.data_inicio = data_inicio;
        this.data_fim = data_fim;
        this.descricao = descricao;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}

module.exports = SalaReservada;
