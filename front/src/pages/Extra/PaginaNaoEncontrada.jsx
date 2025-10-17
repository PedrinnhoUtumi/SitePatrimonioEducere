import { Link } from "react-router-dom";

export function PaginaNaoEncontrada() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
            <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">Página não encontrada</h2>
            <p className="text-gray-600 mb-6">
                Não encontramos a página procurada. Verifique com o administrador para ver se não há nada de errado
            </p>
            <Link
                to="/bens"
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
            >
                Voltar para a bens
            </Link>
        </div>
    );
}
