class User {
    constructor( id_user, cpf, rg, email, nome, senha_hash, created_at, updated_at, created_by ) {
        this.id_user = id_user;
        this.cpf = cpf;
        this.rg = rg;
        this.email = email;
        this.nome = nome;
        this.senha_hash = senha_hash;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.created_by = created_by;
    }
}

module.exports = User;
