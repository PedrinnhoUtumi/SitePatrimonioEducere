import SalasReservadasDao from './salas_reservadas.dao.js'

const salasReservadasDao = new SalasReservadasDao()

export async function findSalas(req, res) {
    try {
        const salas = await salasReservadasDao.getSalas()
        res.json(salas)
    } catch (err) {
        console.error('Erro ao buscar salas:', err)
        res.status(500).json({ erro: 'Erro ao buscar salas' })
    }
}

export async function deleteSalas(req, res) {
    try {
        const { id_reserva } = req.params
        const salas = await salasReservadasDao.deleteReserva(id_reserva)
        res.json(salas)
    } catch (err) {
        console.error('Erro ao buscar salas:', err)
        res.status(500).json({ erro: 'Erro ao buscar salas' })
    }
}

export async function addReserva(req, res) {
    try {
        const { salaId, start, end, ...rest } = req.body

        if (!salaId || !start || !end) {
            return res.status(400).json({ erro: 'Campos obrigatórios: salaId, start, end' })
        }

        const startDate = new Date(start)
        const endDate = new Date(end)
        if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
            return res.status(400).json({ erro: 'start e end devem ser datas válidas (ISO string)' })
        }
        if (startDate >= endDate) {
            return res.status(400).json({ erro: 'start deve ser anterior a end' })
        }

        const conflitos = await salasReservadasDao.findConflictingReservations(
            salaId,
            startDate.toISOString(),
            endDate.toISOString()
        )

        if (conflitos && conflitos.length > 0) {
            return res.status(409).json({
                erro: 'Sala já está ocupada nesse intervalo',
                conflitos
            })
        }

        const novaReserva = {
            id_sala: salaId,
            data_inicio: startDate.toISOString(),
            data_fim: endDate.toISOString(),
            ...rest
        }

        const resultado = await salasReservadasDao.addReserva(novaReserva)

        return res.status(201).json({ sucesso: true, reserva: resultado })
    } catch (err) {
        console.error('Erro ao adicionar reserva:', err)
        return res.status(500).json({ erro: 'Erro ao adicionar reserva' })
    }
}
