import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CONFIG } from "../config";
import { v4 as uuidv4 } from "uuid";

export default function ReservaSala() {
    const [salas, setSalas] = useState([]);
    const [salasLoading, setSalasLoading] = useState(false);
    const [salasError, setSalasError] = useState(null);

    const [salaId, setSalaId] = useState("");
    const [responsavel, setResponsavel] = useState("");
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [descricao, setDescricao] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);

    useEffect(() => {
        const ac = new AbortController();
        const fetchSalas = async () => {
            setSalasLoading(true);
            setSalasError(null);
            try {
                const res = await fetch(`${CONFIG.API_URL}/salas/all`, { signal: ac.signal });
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`Erro ao listar salas: ${res.status} ${text}`);
                }
                const data = await res.json();
                const normalized = Array.isArray(data)
                    ? data.map((item) => ({
                        id: item.id || item.id_sala || item.idSala,
                        label:
                            item.label ||
                            item.nome ||
                            item.nome_sala ||
                            item.nomeSala ||
                            String(item.id || item.id_sala).slice(0, 8),
                    }))
                    : [];
                setSalas(normalized);
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error(err);
                    setSalasError(err.message);
                }
            } finally {
                setSalasLoading(false);
            }
        };

        fetchSalas();
        return () => ac.abort();
    }, []);

    const buildPayload = () => {
        const id_reserva = uuidv4();
        const start = dataInicio ? new Date(dataInicio).toISOString() : null;
        const end = dataFim ? new Date(dataFim).toISOString() : null;

        return {
            id_reserva,
            salaId,
            responsavel,
            start,
            end,
            descricao,
            created_at: new Date().toISOString(),
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg(null);

        if (!salaId) return setMsg({ type: "error", text: "Selecione uma sala." });
        if (!responsavel) return setMsg({ type: "error", text: "Informe o responsável." });
        if (!dataInicio || !dataFim) return setMsg({ type: "error", text: "Informe início e término." });
        if (new Date(dataFim) <= new Date(dataInicio)) {
            return setMsg({ type: "error", text: "Término deve ser depois do início." });
        }

        const payload = buildPayload();

        setLoading(true);
        try {
            const res = await fetch(`${CONFIG.API_URL}/salaReservada/add`, {
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
            setMsg({ type: "success", text: "Reserva cadastrada com sucesso!" });

            setSalaId("");
            setResponsavel("");
            setDataInicio("");
            setDataFim("");
            setDescricao("");
        } catch (err) {
            console.error(err);
            setMsg({ type: "error", text: `Falha ao cadastrar: ${err.message}` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center px-4 py-8">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-6"
            >
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
                    Reservar Sala
                </h2>

                <div className="flex flex-col gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Salas Disponíveis
                        </label>
                        {salasLoading ? (
                            <div className="mt-1 p-2 text-sm">Carregando salas...</div>
                        ) : salasError ? (
                            <div className="mt-1 p-2 text-red-600 text-sm">Erro: {salasError}</div>
                        ) : (
                            <select
                                value={salaId}
                                onChange={(e) => setSalaId(e.target.value)}
                                className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                                required
                            >
                                <option value="">-- selecione --</option>
                                {salas.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.label}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Responsável</label>
                        <input
                            type="text"
                            value={responsavel}
                            onChange={(e) => setResponsavel(e.target.value)}
                            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="dataInicio" className="block text-sm font-medium text-gray-700">
                            Data e hora de início
                        </label>
                        <input
                            id="dataInicio"
                            type="datetime-local"
                            value={dataInicio}
                            onChange={(e) => setDataInicio(e.target.value)}
                            min={new Date().toISOString().slice(0, 16)} // YYYY-MM-DDTHH:MM
                            className="w-full mt-1 p-3 border rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="dataFim" className="block text-sm font-medium text-gray-700">
                            Data e hora de término
                        </label>
                        <input
                            id="dataFim"
                            type="datetime-local"
                            value={dataFim}
                            onChange={(e) => setDataFim(e.target.value)}
                            min={dataInicio ? dataInicio : new Date().toISOString().slice(0, 16)}
                            className="w-full mt-1 p-3 border rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Descrição (opcional)
                        </label>
                        <textarea
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                            rows={3}
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

                <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <Link
                        to="/cadastroSala"
                        className="text-sm text-blue-700 hover:text-indigo-400 transition"
                    >
                        + Cadastrar nova sala
                    </Link>

                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-blue-900 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-60"
                    >
                        {loading ? "Enviando..." : "Reservar Sala"}
                    </button>
                </div>
            </form>
        </div>
    );
}
