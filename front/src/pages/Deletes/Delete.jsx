import { useState, useContext } from "react";
import { Pagina } from "../../componentes/Layout/Pagina";
import { CONFIG } from "../../config";
import { DadosContext } from "../../context/DadosContext";
import { Trash } from "lucide-react";

export function DeleteSala() {
    const { dados } = useContext(DadosContext);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const userLogado = JSON.parse(localStorage.getItem("user"));


    const handleDeleteSalas = async (id) => {
        setError("");
        setSuccess("");

        if (!confirm(`Tem certeza que deseja deletar essa sala?`)) {
            return;
        }

        try {
            const response = await fetch(`${CONFIG.API_URL}/salas/delete/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || "Erro ao deletar a sala.");
                return;
            }

            setSuccess(`Sala ${id} deletada com sucesso!`);
            window.location.reload();
        } catch (err) {
            console.error(err);
            setError("Ocorreu um erro ao deletar a sala.");
        }
    };

    const handleDeleteUsers = async (id) => {
        setError("");
        setSuccess("");

        if (!confirm(`Tem certeza que deseja deletar o usuário?`)) {
            return;
        }

        try {
            const response = await fetch(`${CONFIG.API_URL}/users/delete/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || "Erro ao deletar a sala.");
                return;
            }

            setSuccess(`Sala ${id} deletada com sucesso!`);
            window.location.reload();
        } catch (err) {
            console.error(err);
            setError("Ocorreu um erro ao deletar a sala.");
        }
    };

    return (
        <Pagina>
            <div className="max-w-lg mx-auto w-full p-4 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-red-600">Salas</h2>

                {error && <p className="text-red-500 mb-2">{error}</p>}
                {success && <p className="text-green-500 mb-2">{success}</p>}

                <ul className="divide-y w-full divide-gray-200 overflow-auto" style={{ maxHeight: '350px' }}>
                    {dados.salas.map((sala) => (
                        <li key={sala.id_sala} className="flex justify-between items-center py-2">
                            <span className="text-gray-800 font-medium">{sala.nome_sala}</span>
                            <button
                                onClick={() => handleDeleteSalas(sala.id_sala)}
                                // onClick={() => console.log(dados)}
                                className="text-red-600 hover:text-red-800 transition-colors"
                                title="Deletar Sala"
                            >
                                <Trash />
                            </button>
                        </li>
                    ))}
                </ul>

                {dados.salas.length === 0 && (
                    <p className="text-gray-500 mt-4">Nenhuma sala cadastrada.</p>
                )}
            </div>
            <div className="max-w-lg mx-auto w-full mt-10 p-4 bg-white rounded-lg shadow-md overflow-auto" style={{ maxHeight: '350px' }}>
                <h2 className="text-2xl font-semibold mb-4 text-red-600">Usuários</h2>

                {error && <p className="text-red-500 mb-2">{error}</p>}
                {success && <p className="text-green-500 mb-2">{success}</p>}

                <ul className="divide-y w-full divide-gray-200">
                    {dados.users
                        .filter((user) => user.id_user !== userLogado?.id)
                        .map((user) => (
                            <li key={user.id_user} className="flex justify-between items-center py-2">
                                <span className="text-gray-800 font-medium">{user.nome}</span>
                                <button
                                    onClick={() => handleDeleteUsers(user.id_user)}
                                    // onClick={() => console.log(dados)}
                                    className="text-red-600 hover:text-red-800 transition-colors"
                                    title="Deletar Sala"
                                >
                                    <Trash />
                                </button>
                            </li>
                        ))}
                </ul>

                {dados.salas.length === 0 && (
                    <p className="text-gray-500 mt-4">Nenhuma sala cadastrada.</p>
                )}
            </div>
        </Pagina>
    );
}
