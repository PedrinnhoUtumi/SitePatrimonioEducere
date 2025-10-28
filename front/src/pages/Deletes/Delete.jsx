import { useState, useContext } from "react";
import { Pagina } from "../../componentes/Layout/Pagina";
import { CONFIG } from "../../config";
import { DadosContext } from "../../context/DadosContext";
import { PencilIcon, Trash, X } from "lucide-react";

export function Delete() {
    const [editingSala, setEditingSala] = useState(null);
    const { dados } = useContext(DadosContext);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const userLogado = JSON.parse(localStorage.getItem("user"));

    const openEditModal = (sala) => {
        setEditingSala({ ...sala });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditingSala(null);
        setIsModalOpen(false);
    };

    const handleSave = () => {
        if (!editingSala.nome_sala || !editingSala.tipo_sala) {
            return;
        }
        console.log(editingSala);
        

        handleEditSalas(editingSala);
        closeModal();
    };


    const handleDeleteSalas = async (id) => {
        if (!confirm(`Tem certeza que deseja deletar essa sala?`)) {
            return;
        }

        try {
            const response = await fetch(`${CONFIG.API_URL}/salas/delete/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                await response.json();
                return;
            }

            window.location.reload();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEditSalas = async (editedSala) => {
        const formData = new FormData();
        formData.append("nome_sala", editedSala.nome_sala);
        formData.append("tipo_sala", editedSala.tipo_sala);

        try {
            const response = await fetch(`${CONFIG.API_URL}/salas/update/${editedSala.id_sala}`, {
                method: "PUT",
                body: formData,

            });

            if (!response.ok) {
                await response.json();
                return;
            }

            window.location.reload();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteUsers = async (id) => {
        if (!confirm(`Tem certeza que deseja deletar o usuário?`)) {
            return;
        }

        try {
            const response = await fetch(`${CONFIG.API_URL}/users/delete/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                await response.json();
                return;
            }

            window.location.reload();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Pagina>
            <div className="max-w-lg mx-auto w-full p-4 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-red-600">Salas</h2>
                <ul className="divide-y w-full divide-gray-200 overflow-y-auto" style={{ maxHeight: "350px" }}>
                    {dados.salas.map((sala) => (
                        <li
                            key={sala.id_sala}
                            className="flex justify-between items-center py-3 px-2 hover:bg-gray-50 transition-colors"
                        >
                            <span className="text-gray-800 font-medium">{sala.nome_sala}</span>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => openEditModal(sala)}
                                    className="text-yellow-600 hover:text-yellow-800 transition-colors"
                                    title="Editar Sala"
                                >
                                    <PencilIcon className="w-5 h-5" />
                                </button>

                                <button
                                    onClick={() => handleDeleteSalas(sala.id_sala)}
                                    className="text-red-600 hover:text-red-800 transition-colors"
                                    title="Excluir Sala"
                                >
                                    <Trash className="w-5 h-5" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>

                {dados.salas.length === 0 && (
                    <p className="text-gray-500 mt-4">Nenhuma sala cadastrada.</p>
                )}
            </div>

            <div className="max-w-lg mx-auto w-full mt-10 p-4 bg-white rounded-lg shadow-md overflow-auto" style={{ maxHeight: "350px" }}>
                <h2 className="text-2xl font-semibold mb-4 text-red-600">Usuários</h2>
                <ul className="divide-y w-full divide-gray-200">
                    {dados.users
                        .filter((user) => user.id_user !== userLogado?.id)
                        .map((user) => (
                            <li key={user.id_user} className="flex justify-between items-center py-2">
                                <span className="text-gray-800 font-medium">{user.nome}</span>
                                <button
                                    onClick={() => handleDeleteUsers(user.id_user)}
                                    className="text-red-600 hover:text-red-800 transition-colors"
                                    title="Excluir Usuário"
                                >
                                    <Trash className="w-5 h-5" />
                                </button>
                            </li>
                        ))}
                </ul>

                {dados.users.length === 0 && (
                    <p className="text-gray-500 mt-4">Nenhum usuário cadastrado.</p>
                )}
            </div>

            {isModalOpen && editingSala && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />
                    <form className="relative bg-white w-[90%] max-w-md p-6 rounded-2xl shadow-lg z-10" onSubmit={handleSave}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Editar Sala</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Nome da Sala</label>
                                <input
                                    type="text"
                                    value={editingSala.nome_sala ?? ""}
                                    onChange={(e) => setEditingSala({ ...editingSala, nome_sala: e.target.value })}
                                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
                                    placeholder="Ex: Laboratório 2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Tipo da Sala</label>
                                <input
                                    type="text"
                                    value={editingSala.tipo_sala ?? ""}
                                    onChange={(e) => setEditingSala({ ...editingSala, tipo_sala: e.target.value })}
                                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
                                    placeholder="Ex: Laboratório 2"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 rounded border text-white bg-red-600 hover:text-red-600 hover:border-red-600 hover:bg-red-200 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 border text-white bg-blue-600 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-200 transition"
                            >
                                Salvar
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </Pagina>
    );
}
