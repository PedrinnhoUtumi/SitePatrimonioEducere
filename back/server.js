import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import * as usersController from './src/modules/users/users.controller.js'
import * as bemController from './src/modules/bem/bem.controller.js'
import * as salasController from './src/modules/sala/salas.controller.js'
import * as salasReservadasController from './src/modules/salasReservadas/salas_reservadas.controller.js'


const app = express();
dotenv.config()

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

//User
app.post('/users/cadastro', usersController.cadastroUser);
app.post('/users/login', usersController.loginUser);

//Bem
app.get('/bem/all', bemController.findAll)
app.post('/bem/add', bemController.addBem)
app.get('/bem/search/:id', bemController.unicBem);
app.get('/bem/search', bemController.unicBem);
app.put('/bem/delete/:id', bemController.deleteBem)
app.put('/bem/update/:id', bemController.updateBem)

//salas
app.post('/salas/add', salasController.addSala)
app.get('/salas/all', salasController.findAll)

//salasReservadas
app.get('/salaReservada/findSalas', salasReservadasController.findSalas)
app.post('/salaReservada/add', salasReservadasController.addReserva)

app.get('/API', (req, res) => {
    res.send({ mensagem: 'API funcionando' });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://patrimonio.edu:${PORT}`);
});


// pm2 start server.js --name back
// da uma olhada nisso aqui, lembra do npm i, acho q funciona