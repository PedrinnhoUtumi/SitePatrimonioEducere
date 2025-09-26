import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CONFIG } from "../config";
import { v4 as uuidv4 } from 'uuid';


export default function ReservaSala() {
    const [salas, setSalas] = useState([]);
    const [salasLoading, setSalasLoading] = useState(false);
    const [salasError, setSalasError] = useState(null);

    const [salaId, setSalaId] = useState(""); // id selecionado (uuid)
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
            ? data.map((item) => {
                return {
                    id: item.id || item.id_sala || item.idSala,
                    label: item.label || item.nome || item.nome_sala || item.nomeSala || String(item.id || item.id_sala).slice(0, 8),
                };
                })
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
        // const id_reserva =
        // typeof crypto !== "undefined" && crypto.randomUUID
        //     ? crypto.randomUUID()
        //     : `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        const id_reserva = uuidv4()
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

        // validações básicas
        if (!salaId) return setMsg({ type: "error", text: "Selecione uma sala." });
        if (!responsavel) return setMsg({ type: "error", text: "Informe o responsável." });
        if (!dataInicio || !dataFim) return setMsg({ type: "error", text: "Informe início e término." });
        if (new Date(dataFim) <= new Date(dataInicio))
        return setMsg({ type: "error", text: "Término deve ser depois do início." });

        const payload = buildPayload();

        setLoading(true);
        try {
        const res = await fetch(`${CONFIG.API_URL}/salaReservada/add`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            // "Authorization": `Bearer ${token}` // se necessário
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Erro ${res.status}: ${text}`);
        }

        const data = await res.json();
        setMsg({ type: "success", text: "Reserva cadastrada com sucesso!" });

        // limpa formulário
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
        <div className="flex flex-col justify-center items-end">
        <form
            onSubmit={handleSubmit}
            className="max-w-5xl mx-auto p-6 bg-white shadow-[inset_0_2px_10px_rgba(0,0,0,0.20)] rounded-2xl"
        >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Reservar Sala</h2>

            <div className="flex justify-center flex-col w-[20vw]">
            <div className="flex flex-col gap-4">
                <div>
                <label className="block text-sm font-medium text-gray-700">Salas Disponíveis</label>

                {salasLoading ? (
                    <div className="mt-1 p-2">Carregando salas...</div>
                ) : salasError ? (
                    <div className="mt-1 p-2 text-red-600">Erro: {salasError}</div>
                ) : (
                    <select
                    value={salaId}
                    onChange={(e) => setSalaId(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                    required
                    >
                    <option value="">-- selecione --</option>
                    {salas.length === 0 ? (
                        <option value="" disabled>
                        Nenhuma sala disponível
                        </option>
                    ) : (
                        salas.map((s) => (
                        <option key={s.id} value={s.id}>
                            {s.label}
                        </option>
                        ))
                    )}
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
                <label className="block text-sm font-medium text-gray-700">Data e hora de início</label>
                <input
                    type="datetime-local"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                    className="w-full mt-1 p-3 border rounded-xl bg-white/95 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    aria-label="Data e hora de início"
                    required
                />
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700">Data e hora de término</label>
                <input
                    type="datetime-local"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                    min={dataInicio || undefined}
                    className="w-full mt-1 p-3 border rounded-xl bg-white/95 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    aria-label="Data e hora de término"
                    required
                />
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700">Descrição (opcional)</label>
                <textarea
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                    rows={3}
                />
                </div>
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

            <div className="mt-5 flex flex-col justify-end ">
            <nav className="pb-3 pl-1">
                <Link to={"/cadastroSala"} className="text-blue-700 hover:text-indigo-400 transition">
                Cadastrar Sala
                </Link>
            </nav>

            <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-900 text-white font-medium rounded-lg shadow hover:bg-blue-400 transition disabled:opacity-60"
            >
                {loading ? "Enviando..." : "Reservar Sala"}
            </button>
            </div>
        </form>
        </div>
    );
}
