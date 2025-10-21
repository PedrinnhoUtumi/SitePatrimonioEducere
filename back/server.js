import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fileupload from 'express-fileupload'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

import * as usersController from './src/modules/users/users.controller.js'
import * as bemController from './src/modules/bem/bem.controller.js'
import * as salasController from './src/modules/sala/salas.controller.js'
import * as salasReservadasController from './src/modules/salasReservadas/salas_reservadas.controller.js'

const app = express()
dotenv.config()

app.use(cors())
app.use(express.json())
app.use(fileupload())

app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist')))

app.use('/imagens', express.static(path.join(__dirname, 'src', 'imagens')))

app.get('/users', usersController.findAll)
app.post('/users/cadastro', usersController.cadastroUser)
app.post('/users/login', usersController.loginUser)
app.put('/users/update', usersController.atualizarUser)
app.delete('/users/delete/:id', usersController.deleteUsers)

app.get('/bem/all', bemController.findAll)
app.post('/bem/add', bemController.addBem)
app.get('/bem/search/:id', bemController.unicBem)
app.get('/bem/search', bemController.unicBem)
app.put('/bem/delete/:id', bemController.deleteBem)
app.put('/bem/update/:id', bemController.updateBem)

app.post('/salas/add', salasController.addSala)
app.get('/salas/all', salasController.findAll)
app.delete('/salas/delete/:id', salasController.deleteSala)

app.get('/salaReservada/findSalas', salasReservadasController.findSalas)
app.post('/salaReservada/add', salasReservadasController.addReserva)
app.delete('/salaReservada/delete/:id_reserva', salasReservadasController.deleteSalas)

app.get('/API', (req, res) => {
    res.send({ mensagem: 'API funcionando' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    // console.log(`Servidor rodando em http://patrimonio.edu:${PORT}`)
    console.log(`Servidor rodando em http://localhost:${PORT}`)
})
