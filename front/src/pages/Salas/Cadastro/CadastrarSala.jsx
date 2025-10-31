import React, { useState } from "react";
import { CONFIG } from "../../../config";
import { Pagina } from "../../../componentes/Layout/Pagina";

export function CadastrarSala() {
    const [nomeSala, setNomeSala] = useState("");
    const [tipoSala, setTipoSala] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);

    const buildSalaPayload = () => {
        const id = typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

        return {
            id_sala: id,
            nome_sala: nomeSala,
            tipo_sala: tipoSala,
            created_at: new Date().toISOString(),
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg(null);
        setLoading(true);

        const payload = buildSalaPayload();

        try {
            const res = await fetch(`${CONFIG.API_URL}/salas/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Erro ${res.status}: ${text}`);
            }

            await res.json();
            setMsg({ type: "success", text: "Sala cadastrada com sucesso!" });
            setNomeSala("");
            setTipoSala("");
        } catch (err) {
            console.error(err);
            setMsg({ type: "error", text: `Falha ao cadastrar: ${err.message}` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Pagina>
            <div className="flex flex-col min-h-screen w-full">
                <main className="flex-grow flex items-center justify-center px-4 py-8">
                    <form
                        onSubmit={handleSubmit}
                        className="w-full max-w-md bg-white shadow-md rounded-2xl p-6"
                    >
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
                            Cadastrar Sala
                        </h2>

                        <div className="flex flex-col gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Nome da Sala
                                </label>
                                <input
                                    type="text"
                                    value={nomeSala}
                                    onChange={(e) => setNomeSala(e.target.value)}
                                    className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                                    placeholder="Ex: Sala A"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Tipo da Sala
                                </label>
                                <input
                                    type="text"
                                    value={tipoSala}
                                    onChange={(e) => setTipoSala(e.target.value)}
                                    className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                                    placeholder="Ex: Reunião, Aula"
                                    required
                                />
                            </div>
                        </div>

                        {msg && (
                            <div
                                className={`mt-4 p-3 rounded text-sm ${msg.type === "success"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                            >
                                {msg.text}
                            </div>
                        )}

                        <div className="mt-6 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-blue-900 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-60"
                            >
                                {loading ? "Cadastrando..." : "Cadastrar Sala"}
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </Pagina>
    );
}
