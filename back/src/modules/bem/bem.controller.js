import BemDao from './bem.dao.js'

const bemDao = new BemDao();

export async function findAll(req, res){
    try {
        const Bem = await bemDao.getBens()
        res.json(Bem)
    } catch (error) {
        console.error('Erro ao retornar bens:', err)
        res.status(500).json({ erro: 'Erro ao retornar bens' })
    }
}

export async function addBem(req, res) {
    try {
        const max = await bemDao.getMaxIdQr();

        req.body.idQrCode = max + 1;

        const Bem = await bemDao.addBem(req.body);
        return res.json(Bem);
    } catch (error) {
        console.error('Erro ao cadastrar Bem: ', error);
        return res.status(500).json({ erro: 'Erro ao cadastrar Bem' });
    }
}

export async function deleteBem(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
        return res.status(400).json({ error: 'Parâmetro id é obrigatório.' });
        }

        const deletedRows = await bemDao.deleteBem(id);

        if (!deletedRows || deletedRows.length === 0) {
        return res.status(404).json({ message: 'Bem não encontrado.' });
        }

        return res.status(200).json({
        message: 'Bem deletado com sucesso.',
        deleted: deletedRows,
        });
    } catch (err) {
        console.error('deleteBem error:', err);
        const status = err?.status || 500;
        return res.status(status).json({ error: err.message || 'Erro ao deletar bem.' });
    }
};

export async function unicBem(req, res) {
    try {
        const id = req.params.id ?? req.query.id;
        if (!id) {
        return res.status(400).json({ error: 'Parâmetro id é obrigatório.' });
        }

        const Bem = await bemDao.getUnicBem(id);

        if (!Bem) {
        return res.status(404).json({ message: 'Bem não encontrado.' });
        }

        return res.status(200).json(Bem);
    } catch (err) {
        console.error('unicBem error:', err);

        const status = err?.status || 500;
        const response = { error: err.message || 'Erro ao buscar bem.' };
        if (isDev && err.stack) response.stack = err.stack;
        return res.status(status).json(response);
    }
}

export const updateBem = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'Parâmetro id é obrigatório.' });
        }

        const rawBody = req.body ?? {};
        const forbidden = new Set(['id', 'created_at', 'createdAt']);

        const updates = {};
        Object.keys(rawBody).forEach((key) => {
        if (forbidden.has(key)) return;
        const val = rawBody[key];
        if (typeof val !== 'undefined') updates[key] = val;
        });

        if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'Nenhum campo válido para atualizar foi enviado.' });
        }

        const updatedRows = await bemDao.updateBem(id, updates);

        if (!updatedRows || updatedRows.length === 0) {
        return res.status(404).json({ message: 'Bem não encontrado (ou nenhuma alteração aplicada).' });
        }

        return res.status(200).json({
        message: 'Bem atualizado com sucesso.',
        updated: updatedRows,
        });
    } catch (err) {
        console.error('updateBem error:', err);
        const status = err?.status || 500;
            return res.status(status).json({ error: err.message || 'Erro ao atualizar bem.' });
    }
};