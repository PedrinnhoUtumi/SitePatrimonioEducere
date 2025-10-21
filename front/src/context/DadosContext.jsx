import { createContext, useEffect, useState } from "react";
import { CONFIG } from "../config";

export const DadosContext = createContext();

export function DadosProvider({ children }) {
    // Estado inicial com estrutura clara
    const [dados, setDados] = useState({ salas: [], salasReservadas: [], bens: [], users: [] });

    function adicionarDados(novosDadosPorTabela) {
        if (!novosDadosPorTabela || typeof novosDadosPorTabela !== "object") return;

        setDados((prev) => {
            const novoEstado = { ...prev };
            for (const [tabela, registros] of Object.entries(novosDadosPorTabela)) {
                if (!Array.isArray(registros)) continue;

                const existentes = new Set(
                    (novoEstado[tabela] || []).map((item) => JSON.stringify(item))
                );
                const novosUnicos = registros.filter(
                    (item) => !existentes.has(JSON.stringify(item))
                );
                novoEstado[tabela] = [...(novoEstado[tabela] || []), ...novosUnicos];
            }
            return novoEstado;
        });
    }

    useEffect(() => {
        const fetchAPISalas = async () => {
            try {
                const response = await fetch(`${CONFIG.API_URL}/salas/all`);
                if (!response.ok) {
                    throw new Error("Erro ao buscar os dados do servidor");
                }

                const json = await response.json();

                if (Array.isArray(json)) {
                    adicionarDados({ salas: json });
                }

                else if (json.message && Array.isArray(json.message)) {
                    adicionarDados({ salas: json.message });
                }

            } catch (err) {
                console.error("❌ Erro na requisição:", err.message);
            }
        };

        fetchAPISalas();
    }, []);

    useEffect(() => {
        const fetchAPIUsers = async () => {
            try {
                const response = await fetch(`${CONFIG.API_URL}/users`);
                if (!response.ok) {
                    throw new Error("Erro ao buscar os dados do servidor");
                }

                const json = await response.json();

                if (Array.isArray(json)) {
                    adicionarDados({ users: json });
                }

                else if (json.message && Array.isArray(json.message)) {
                    adicionarDados({ users: json.message });
                }

            } catch (err) {
                console.error("❌ Erro na requisição:", err.message);
            }
        };

        fetchAPIUsers();
    }, []);

    const exportar = {
        dados,
        adicionarDados,
    };

    return (
        <DadosContext.Provider value={exportar}>{children}</DadosContext.Provider>
    );
}