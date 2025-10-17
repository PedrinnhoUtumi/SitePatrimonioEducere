import { Navigate, Outlet } from "react-router-dom";

export function RotaProtegida({ tiposPermitidos = [] }) {
    const usuarioString = localStorage.getItem("user");
    const usuario = usuarioString ? JSON.parse(usuarioString) : null;

    const estaAutenticado = usuario !== null;

    const temPermissao =
        tiposPermitidos.length === 0 || tiposPermitidos.includes(usuario?.type);

    if (!estaAutenticado) {
        return <Navigate to="/" replace />;
    }

    if (!temPermissao) {
        return <Navigate to="/nao-autorizado" replace />;
    }

    return <Outlet />;
}
