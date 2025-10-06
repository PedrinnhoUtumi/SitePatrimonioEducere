import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fileupload from 'express-fileupload'

import * as usersController from './src/modules/users/users.controller.js'
import * as bemController from './src/modules/bem/bem.controller.js'
import * as salasController from './src/modules/sala/salas.controller.js'
import * as salasReservadasController from './src/modules/salasReservadas/salas_reservadas.controller.js'


const app = express();
dotenv.config()

app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'));
app.use(fileupload());
app.use('/src/imagens', express.static('/src/imagens'));

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.post('/users/cadastro', usersController.cadastroUser);
app.post('/users/login', usersController.loginUser);

app.get('/bem/all', bemController.findAll)
app.post('/bem/add', bemController.addBem)
app.get('/bem/search/:id', bemController.unicBem);
app.get('/bem/search', bemController.unicBem);
app.put('/bem/delete/:id', bemController.deleteBem)
app.put('/bem/update/:id', bemController.updateBem)

app.post('/salas/add', salasController.addSala)
app.get('/salas/all', salasController.findAll)

app.get('/salaReservada/findSalas', salasReservadasController.findSalas)
app.post('/salaReservada/add', salasReservadasController.addReserva)

app.get('/API', (req, res) => {
    res.send({ mensagem: 'API funcionando' });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://http://192.168.3.250:${PORT}`);
});
