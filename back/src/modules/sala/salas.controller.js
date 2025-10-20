import SalasDao from './sala.dao.js'

const salasDao = new SalasDao();

export async function findAll ( req, res){
    try {
        const highlight = await salasDao.findAll()
        res.json(highlight)
    } catch (error) {
        console.error('erro ao buscar Destaques: ', err)
        res.status(500).json({erro: 'erro ao buscar destaques'})
    }
}
export async function addSala(req, res) {
    try {
        const Salas = await salasDao.addSala(req.body);
        return res.json(Salas);
    } catch (error) {
        console.error('Erro ao cadastrar Sala: ', error);
        return res.status(500).json({ erro: 'Erro ao cadastrar Sala' });
    }
}

export async function deleteSala(req, res) {
    const { id } = req.params
    try {
        const Salas = await salasDao.deleteSala(id);
        return res.json(Salas);
    } catch (error) {
        console.error('Erro ao excluir Sala: ', error);
        return res.status(500).json({ erro: 'Erro ao excluir Sala' });
    }
}