import React, { useState } from "react";
import Menu from "../componentes/menuTop";
import Foot from "../componentes/Footer";
import { CONFIG } from "../config";

export default function AdcionaBem() {
    const [nomeSala, setNomeSala] = useState("");
    const [tipoSala, setTipoSala] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);

    const buildSalaPayload = () => {
        const id = typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.floor(Math.random()*10000)}`;

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
        const res = await fetch(`${CONFIG.API_URL}/salas/add` , {
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

        const data = await res.json();
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
        <div className="flex flex-col justify-between h-[100vh]">
        <Menu />
        <div className="h-[80vh] flex ">
            <form
            onSubmit={handleSubmit}
            className="w-[30vw] h-[42vh] mx-auto p-6 bg-white shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)] rounded-2xl"
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
                className={`mt-4 p-2 rounded ${
                    msg.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
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
        </div>
        <Foot />
        </div>
    );
}
