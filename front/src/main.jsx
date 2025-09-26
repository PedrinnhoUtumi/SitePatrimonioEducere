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
