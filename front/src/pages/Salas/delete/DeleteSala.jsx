import { useState, useContext } from "react";
import { Pagina } from "../../../componentes/Layout/Pagina";
import { CONFIG } from "../../../config";
import { DadosContext } from "../../../context/DadosContext";
import { Trash } from "lucide-react";

export function DeleteSala() {
    const { dados } = useContext(DadosContext);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleDelete = async (id) => {
        setError("");
        setSuccess("");

        if (!confirm(`Tem certeza que deseja deletar a sala ${id}?`)) {
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
            // Opcional: atualizar dados.salas após delete, se estiver no mesmo contexto
            // Aqui você precisaria de uma função para atualizar o context
        } catch (err) {
            console.error(err);
            setError("Ocorreu um erro ao deletar a sala.");
        }
    };

    return (
        <Pagina>
            <div className="max-w-lg mx-auto mt-10 p-4 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-red-600">Salas</h2>

                {error && <p className="text-red-500 mb-2">{error}</p>}
                {success && <p className="text-green-500 mb-2">{success}</p>}

                <ul className="divide-y divide-gray-200">
                    {dados.salas.map((sala) => (
                        <li key={sala.id_sala} className="flex justify-between items-center py-2">
                            <span className="text-gray-800 font-medium">{sala.nome_sala} (ID: {sala.id_sala})</span>
                            <button
                                onClick={() => handleDelete(sala.id_sala)}
                                className="text-red-600 hover:text-red-800 transition-colors"
                                title="Deletar Sala"
                            >
                                <Trash/>
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
