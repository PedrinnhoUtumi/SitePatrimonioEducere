import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";


import { Login } from "./pages/Usuario/Login"
import { CadastroBem } from "./pages/Bem/CadastroBem"
import { Cadastro } from "./pages/Usuario/Cadastro"
import { SalasReservadas } from "./pages/Salas/Reservadas/SalasReservadas"
import { CadastrarSala } from "./pages/Salas/Cadastro/CadastrarSala"
import "./index.css";
import { RotaProtegida } from "./componentes/Layout/RotaProtegida";
import PaginaBem from "./pages/QRCode/BensId"
import { NaoAutorizado } from "./pages/Extra/NaoAutorizado";
import { PaginaNaoEncontrada } from "./pages/Extra/PaginaNaoEncontrada";
import { Layout } from "./pages/_Layout";
import { DeleteSala } from "./pages/Salas/delete/DeleteSala";
import { DadosProvider } from "./context/DadosContext";

const rotas = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route index element={<Login />} />
      <Route element={< RotaProtegida tiposPermitidos={["Administrador"]} />}>
        <Route path="/cadastro" element={<Cadastro />} />
      </Route>
      <Route path="/bensid/:id" element={<PaginaBem />} />
      <Route path="/nao-autorizado" element={<NaoAutorizado />} />
      <Route path="/*" element={<PaginaNaoEncontrada />} />
      <Route path="/" element={<Layout />}>

        <Route element={<RotaProtegida tiposPermitidos={["Visualizador", "Administrador"]} />}>
          <Route path="/bens" element={<CadastroBem />} />
        </Route>


        <Route element={< RotaProtegida tiposPermitidos={["Visualizador", "Administrador"]} />}>
          <Route path="/salas" element={<SalasReservadas />} />
        </Route>

        <Route element={< RotaProtegida tiposPermitidos={["Administrador"]} />}>
          <Route path="/cadastroSala" element={<CadastrarSala />} />
        </Route>
        <Route element={< RotaProtegida tiposPermitidos={["Administrador"]} />}>
          <Route path="/deleteSala" element={<DeleteSala />} />
        </Route>
      </Route>
    </>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <DadosProvider>
      <RouterProvider router={rotas} />
    </DadosProvider>
  </StrictMode>
);
