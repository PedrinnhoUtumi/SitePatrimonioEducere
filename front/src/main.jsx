import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";


import Login from "./pages/Login"
import CadastroBem from "./pages/CadastroBem"
import Cadastro from "./pages/Cadastro"
import Salas from "./pages/SalasReservadas"
import CadastroSala from "./pages/CadastrarSala"
import "./index.css";
import { RotaProtegida } from "./componentes/RotaProtegida";
import PaginaBem from "./pages/BensId"
import { NaoAutorizado } from "./pages/NaoAutorizado";
import { PaginaNaoEncontrada } from "./pages/PaginaNaoEncontrada";

const rotas = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Login />} />

      <Route element={<RotaProtegida tiposPermitidos={["Visualizador", "Administrador"]} />}>
        <Route path="/bens" element={<CadastroBem />} />
      </Route>

      <Route element={< RotaProtegida tiposPermitidos={["Administrador"]} />}>
        <Route path="/cadastro" element={<Cadastro />} />
      </Route>

      <Route element={< RotaProtegida tiposPermitidos={["Visualizador", "Administrador"]} />}>
        <Route path="/salas" element={<Salas />} />
      </Route>

      <Route element={< RotaProtegida tiposPermitidos={["Administrador"]} />}>
        <Route path="/cadastroSala" element={<CadastroSala />} />
      </Route>
      <Route path="/bensid/:id" element={<PaginaBem />} />
      <Route path="/nao-autorizado" element={<NaoAutorizado />} />
      <Route path="/*" element={<PaginaNaoEncontrada />} />

    </>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
      <RouterProvider router={rotas} />
  </StrictMode>
);

// <!DOCTYPE html>
// <html lang="en">

// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <link rel="stylesheet" href="CadastroItem.css">
//     <script src="CadastroItem.js" defer></script>
//     <title>Document</title>
// </head>
// <body>
//     <div class="container">
//         <header>
//             <button class="botao1" id="botao">
//                 &#9776
//             </button>
//             <ul class="menu_lista" id="menu">
//                 <div class="menu_conteudo">
//                     <li><a href="../Login.php">LOGIN</a></li>
//                     <li><a href="../Usuario/CadastroUser.php">CADASTRO</a></li>
//                     <!-- <li><a href="../Modulos/Modulo1">MÓDULO 01</a></li>
//                     <li><a href="../Modulos/Modulo2">MÓDULO 02</a></li> -->
//                     <li><a href="../SalasReservadas/SalasReservadas.php">SALAS RESERVADAS</a></li>
//                 </div>
//             </ul>
//             <img class="impressora" src="../imagem/impressora1.png" alt="">
//             <img src="../imagem/salve1.png" alt="">
//             <img class="cancelar" src="../imagem/cancelar1.png" alt="">
//         </header>

//         <input type="text" id="searchInput" placeholder="Pesquisar...">
//         <div class="consultar_cadastrar">
//             <p id="um">Consultar</p>
//             <p id="dois">Cadastrar</p>
//         </div>
//         <div class="titulo_pagina">
//             Identificação do bem
//         </div>
        
//         <form method="POST" action="../../DAOS/ItensDAO.php" id="iformulario">
//             <input type="hidden" id="iid" name="id" value="">
//             <div class="principais">
//             <label for="icategoria">Categoria</label>
//             <div class="select">
//                     <br>
//                 <select disabled selected id="icategoria" class="cat" name="categoria" required >
//                     <option value="Equipamentos">Equipamentos</option>
//                     <option value="Moveis">Móveis</option>
//                     <option value="Roupas">Máquinas</option>
//                     <option value="Veículos">Veículos</option>
//                     <option value="Eletrodomésticos">Eletrodomésticos</option>
//                     <option value="Utensílios">Utensílios</option>
//                     <option value="Utensílios">Eletroeletônicos</option>
//                     <option value="Eletroeletônicos">Equipamentos de informática</option>
//                 </select>
//             </div>
//                 <br>
//                 <label for="inome">Descrição do bem</label>
//                 <input type="text" id="inome" name="nome" required disabled>
//                 <label for="idata_compra">Data de aquisição</label>
//                 <input type="date" id="idata_compra" name="data_compra" disabled required>
//                 <label for="idata_exclusao">Data da baixa</label>
//                 <input type="date" id="idata_exclusao" name="data_exclusao" disabled>
//                 <label for="ijustificativa">Justificativa da baixa</label>
//                 <div class="select">
//                 <select disabled selected id="ijustificativa" class="cat" name="justificativa" required >
//                     <option value="Equipamentos">Transferência</option>
//                     <option value="Moveis">Cessão</option>
//                     <option value="Roupas">Alienação (Venda)</option>
//                     <option value="Veículos">Alienação (Permuta)</option>
//                     <option value="Eletrodomésticos">Alienação (Doação)</option>
//                     <option value="Utensílios">Destinação final ambientalmente adequada</option>
//                     <option value="Utensílios">Desaparecimento</option>
//                     <option>
//                 </select>
//                 </div>
//                 <label for="idepeciacao">Depreciação anual</label>
//                 <input type="text" id="idepreciacao" name="depreciacao"  max="2025-12-31" required disabled>

//             </div>
//             <div class="informacao">
//                 <label for="ivalor">Valor da aquisição</label>
//                 <input type="text" id="ivalor" name="valor" disabled required>
//                 <label for="iresidual">Valor residual</label>
//                 <input type="text" id="iresidual" name="residual" disabled>
//                 <label for="imarca">Marca</label>
//                 <input type="text" id="imarca" name="marca" disabled required>
//                 <label for="ilocal">Localização</label>
//                 <div class="select">
//                     <select disabled required selected id="ilocal" class="cat" name="local" >
//                     <option value="Avariado">Prototipagem</option>
//                         <option value="Usado">Arquivo morto (Subsolo)</option>
//                         <option value="Avariado">Sala 001 (Administrativo)</option>
//                         <option value="Avariado">Sala 002 (Auditório)</option>
//                         <option value="Avariado">Sala 003</option>
//                         <option value="Avariado">Sala 004 (Data Center)</option>
//                         <option value="Avariado">Sala 005</option>
//                         <option value="Avariado">Sala 006</option>
//                         <option value="Avariado">Sala 007</option>
//                         <option value="Avariado">Sala 101</option>
//                         <option value="Avariado">Sala 102</option>
//                         <option value="Avariado">Sala 103</option>
//                         <option value="Avariado">Sala 104</option>
//                         <option value="Avariado">Sala 105</option>
//                         <option value="Avariado">Sala 106</option>
//                         <option value="Avariado">Sala 107 (Modelagem de negócio)</option>
//                         <option value="Avariado">Sala 108 (Coworking)</option>
//                         <option value="Avariado">Sala 109 (Planejameno)</option>
//                         <option value="Avariado">Sala 110 (Almoxerifado)</option>
//                         <option value="Avariado">Sala 111 (Sala google)</option>
//                         <option value="Avariado">Sala 112</option>
//                         <option value="Avariado">Sala 113</option>
//                         <option value="Avariado">Sala 114 (Estúdio)</option>
//                         <option value="Avariado">Sala 115</option>
//                         <option value="Avariado">Sala 201</option>
//                         <option value="Avariado">Sala 203 (Lab. programação)</option>
//                         <option value="Avariado">Sala 203 (Sala de treinamento)</option>
//                         <option value="Avariado">Sala 204 (Lab. mecânica)</option>
//                         <option value="Avariado">Sala 205 (lb. Eletrônica)</option>
//                         <option value="Avariado">Sala 206</option>
//                         <option value="Avariado">Sala 207</option>
//                         <option value="Avariado">Sala 208</option>
//                         <option value="Avariado">Sala 209</option>
//                         <option value="Avariado">Sala 210</option>
//                         <option value="Avariado">Sala 211</option>
//                         <option value="Avariado">Sala 212 ( Lab. Ciências Aplicadas)</option>
//                         <option value="Avariado">Sala 213</option>
//                         <option value="Avariado">Copa Térreo</option>
//                         <option value="Avariado">Copa Primeiro andar</option>
//                         <option value="Avariado">Copa Segundo andar</option>
//                         <option value="Avariado">Copa Terceiro andar (Cozinha 2)</option>
//                         <option value="Avariado">Corredor Térreo</option>
//                         <option value="Avariado">Corredor Primeiro andar</option>
//                         <option value="Avariado">Corredor Segundo andar</option>
//                         <option value="Avariado">Corredor/Churrasqueira Terceiro andar</option>
//                         <option value="Avariado">DML Térreo</option>
//                         <option value="Avariado">DML Primeiro andar</option>
//                         <option value="Avariado">DML Segundo andar</option>
//                         <option value="Avariado">DML Terceiro andar</option>
//                     </select>
//                 </div>
//                 <label for="imodelo">Modelo</label>
//                 <input id="imodelo" name="modelo" disabled></input>
//                 <label for="iestado">Estado de conservação</label>
//                 <div class="select">
//                     <br>
//                     <select disabled required selected id="iestado" class="cat" name="estado" >
//                         <option value="Novo">Novo</option>
//                         <option value="Usado">Usado recente</option>
//                         <option value="Usado">Anos de uso</option>
//                         <option value="Avariado">Avariado</option>
//                     </select>
//                 </div>
//                 <img id="ifotos" src="cadastro.jpg" alt="">
//             </div>
            
//                 <img id="ifotos" src="cadastro.jpg" alt="">
//             </div>
//             <button type="submit" class="botao2" id="botao2">Adicionar</button>
//             <button type="submit" class="botao2" id="botao3" style = "display: none">Editar</button>
//         </form>
//     </div> 
//     <div class="mostrar" style="display: none">
//         <label for="">Para conseguir cadastrar itens, entre com sua chave de acesso</label>
//         <br>
//         <input type="password" name="premium" id="ipremium" placeholder="Chave" required minlength="3">
//         <br>
//         <div class="botoes">
//             <button id="icancelar" class="botao_verifica">Cancelar</button>
//             <button class="botao_verifica" id="ibotao_veri">Enviar</button>
//         </div>
//     </div>
// </body>
// </html>