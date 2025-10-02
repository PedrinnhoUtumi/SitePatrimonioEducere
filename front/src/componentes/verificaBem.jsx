import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import SyncLoader from "react-spinners/SyncLoader";
import { CONFIG } from "../config";

export default function VerificaBem() {
    const [bens, setBens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBem, setEditingBem] = useState(null);
    const [saving, setSaving] = useState(false);
    const [processingId, setProcessingId] = useState(null);

    const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user")) : null;
    const userType = user?.type ?? "Visualizador";

    const fetchBens = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${CONFIG.API_URL}/bem/all`);
            if (!response.ok) throw new Error("Erro ao buscar os bens");
            const data = await response.json();

            const active = Array.isArray(data)
                ? data.filter((b) => !(b?.status === false || b?.status === "false"))
                : [];
            setBens(active);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchBens();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-80">
                <SyncLoader color="#111827" speedMultiplier={1} />
            </div>
        );
    }

    if (error) {
        return <p className="text-red-600">Erro: {error}</p>;
    }

    const toInputDate = (iso) => {
        if (!iso) return "";
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return "";
        const pad = (n) => String(n).padStart(2, "0");
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    };

    const openEditModal = (bem) => {
        setEditingBem({
            ...bem,
            data_aquisicao: toInputDate(bem.data_aquisicao),
            data_baixa: bem.data_baixa ? toInputDate(bem.data_baixa) : "",
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingBem(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditingBem((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!editingBem) return;
        setSaving(true);

        try {
            const id = editingBem.id_bem ?? editingBem.id;

            const payload = {
                categoria: editingBem.categoria,
                descricao_do_bem: editingBem.descricao_do_bem,
                marca: editingBem.marca,
                modelo: editingBem.modelo,
                localizacao_text: editingBem.localizacao_text,
                valor_aquisicao: editingBem.valor_aquisicao ? Number(editingBem.valor_aquisicao) && editingBem.valor_aquisicao >= editingBem.valor_residual : null,
                valor_residual: editingBem.valor_residual ? Number(editingBem.valor_residual) : null,
                estado_conservacao: editingBem.estado_conservacao,
                data_aquisicao: editingBem.data_aquisicao ? new Date(editingBem.data_aquisicao).toISOString() : null,
                data_baixa: editingBem.data_baixa ? new Date(editingBem.data_baixa).toISOString() : null,
                depreciacao_percent: editingBem.depreciacao_percent ? Number(editingBem.depreciacao_percent) : null,
                justificativa_baixa: editingBem.justificativa_baixa,
            };

            const res = await fetch(`${CONFIG.API_URL}/bem/update/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Erro ao atualizar bem: ${res.status} ${text}`);
            }

            closeModal();
            await fetchBens();

        } catch (err) {
            console.error(err);
            alert(err.message || "Erro ao salvar");
        } finally {
            setSaving(false);
        }
    };


    const handleInvalidate = async (bem) => {
        const id = bem.id_bem ?? bem.id;
        const ok = confirm(`Deseja marcar o bem "${bem.descricao_do_bem}" como inválido?`);
        if (!ok) return;

        try {
            setProcessingId(id);

            const url = `${CONFIG.API_URL}/bem/delete/${encodeURIComponent(id)}`;
            const res = await fetch(url, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({ status: false /*, justificativa_baixa: "..." se precisar */ }),
            });

            const text = await res.text();
            let body;
            try {
                body = JSON.parse(text);
            } catch {
                body = text;
            }

            if (!res.ok) {
                console.error("Resposta inválida:", res.status, body);
                throw new Error(`Erro ao invalidar: ${res.status} ${typeof body === "string" ? body : JSON.stringify(body)}`);
            }

            const updatedBem = Array.isArray(body) ? body[0] : body;

            if (updatedBem && (updatedBem.status === false || updatedBem.status === "false")) {
                setBens((prev) => prev.filter((b) => (b.id_bem ?? b.id) !== id));
            } else {
                setBens((prev) =>
                    prev.map((b) => {
                        const key = b.id_bem ?? b.id;
                        if (key === id) return { ...b, ...updatedBem };
                        return b;
                    })
                );
            }
            closeModal();
            await fetchBens();
            alert("Bem invalidado com sucesso.");
        } catch (err) {
            console.error(err);
            alert(err.message || "Erro ao invalidar bem");
        } finally {
            setProcessingId(null);
        }
    };

    const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString() : "-");

    return (
        <div className="w-full px-4 py-6">
            <div className="max-w-[1400px] mx-auto bg-white rounded-2xl p-4 shadow-[inset_0_2px_10px_rgba(0,0,0,0.08)]">
                <h2 className="text-2xl font-semibold mb-4">Bens Cadastrados</h2>

                {bens.length === 0 ? (
                    <p className="text-center text-gray-500 py-10">
                        Não existe bem cadastrado.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto border-collapse text-sm">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-3 py-2 border text-left">Tipo do bem</th>
                                    <th className="px-3 py-2 border text-left">Descrição</th>
                                    <th className="px-3 py-2 border text-left">Marca</th>
                                    <th className="px-3 py-2 border text-left">Localização</th>
                                    <th className="px-3 py-2 border text-left">Data aquisição</th>
                                    <th className="px-3 py-2 border text-left">Data exclusão</th>
                                    <th className="px-3 py-2 border text-left">Depreciação</th>
                                    <th className="px-3 py-2 border text-left">Justificativa da exclusão</th>
                                    <th className="px-3 py-2 border text-left">Valor aquisição</th>
                                    <th className="px-3 py-2 border text-left">Valor residual</th>
                                    <th className="px-3 py-2 border text-left">Modelo</th>
                                    <th className="px-3 py-2 border text-left">Estado</th>
                                    <th className="px-3 py-2 border text-left">QR code</th>
                                    {userType === "Administrador" && (
                                        <th className="px-3 py-2 border text-left">Ações</th>
                                    )}
                                </tr>
                            </thead>

                            <tbody>
                                {bens.map((bem, idx) => {
                                    const id = bem.id_bem ?? bem.id;
                                    const rowBg = idx % 2 === 0 ? "bg-green-50" : "bg-white";

                                    return (
                                        <tr key={id} className={`${rowBg} align-center`}>
                                            <td className="px-3 py-2 border">{bem.categoria ?? "-"}</td>
                                            <td className="px-3 py-2 border max-w-[260px] break-words">
                                                {bem.descricao_do_bem ?? "-"}
                                            </td>
                                            <td className="px-3 py-2 border">{bem.marca ?? "-"}</td>
                                            <td className="px-3 py-2 border">{bem.localizacao_text ?? "-"}</td>
                                            <td className="px-3 py-2 border">{formatDate(bem.data_aquisicao)}</td>
                                            <td className="px-3 py-2 border">{formatDate(bem.data_baixa)}</td>
                                            <td className="px-3 py-2 border">{bem.depreciacao_percent ?? "-"}%</td>
                                            <td className="px-3 py-2 border max-w-[220px] break-words">
                                                {bem.justificativa_baixa ?? "-"}
                                            </td>
                                            <td className="px-3 py-2 border">R$ {bem.valor_aquisicao ?? "-"}</td>
                                            <td className="px-3 py-2 border">R$ {bem.valor_residual ?? "-"}</td>
                                            <td className="px-3 py-2 border">{bem.modelo ?? "-"}</td>
                                            <td className="px-3 py-2 border">{bem.estado_conservacao ?? "-"}</td>
                                            <td className="px-3 py-2 border">
                                                <div className="w-20 h-20 flex items-center justify-center">
                                                    <QRCodeCanvas
                                                        value={`http://patrimonio.edu/Bensid/${bem.id_bem ?? bem.id ?? ""}`}
                                                        size={80}
                                                    />
                                                </div>
                                            </td>

                                            {userType === "Administrador" && (
                                                <td className="px-3 py-2 border">
                                                    <div className="flex flex-col gap-2">
                                                        <button
                                                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition"
                                                            onClick={() => openEditModal(bem)}
                                                        >
                                                            Atualizar
                                                        </button>
                                                        <button
                                                            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition"
                                                            onClick={() => handleInvalidate(bem)}
                                                            disabled={processingId === id}
                                                        >
                                                            {processingId === id ? "Processando..." : "Excluir"}
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {isModalOpen && editingBem && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/50" onClick={closeModal} />

                        <div className="relative bg-white w-[90%] max-w-3xl p-6 rounded-2xl shadow-lg z-10">
                            <h2 className="text-xl font-semibold mb-4">Atualizar Bem</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className="flex flex-col">
                                    <span className="text-sm">Categoria</span>
                                    <select
                                        name="categoria"
                                        value={editingBem.categoria ?? ""}
                                        onChange={handleChange}
                                        className="border rounded px-2 py-1"
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="Móveis">Móveis</option>
                                        <option value="Equipamentos">Equipamentos</option>
                                        <option value="Veículos">Veículos</option>
                                        <option value="Imóveis">Imóveis</option>
                                        <option value="Outros">Outros</option>
                                    </select>
                                </label>

                                <label className="flex flex-col">
                                    <span className="text-sm">Marca</span>
                                    <input
                                        name="marca"
                                        value={editingBem.marca ?? ""}
                                        onChange={handleChange}
                                        className="border rounded px-2 py-1"
                                    />
                                </label>

                                <label className="flex flex-col">
                                    <span className="text-sm">Modelo</span>
                                    <input
                                        name="modelo"
                                        value={editingBem.modelo ?? ""}
                                        onChange={handleChange}
                                        className="border rounded px-2 py-1"
                                    />
                                </label>

                                <label className="flex flex-col">
                                    <span className="text-sm">Localização</span>
                                    <select
                                        name="localizacao_text"
                                        value={editingBem.localizacao_text ?? ""}
                                        onChange={handleChange}
                                        className="border rounded px-2 py-1"
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="Almoxarifado">Almoxarifado</option>
                                        <option value="Escritório">Escritório</option>
                                        <option value="Laboratório">Laboratório</option>
                                        <option value="Sala de Aula">Sala de Aula</option>
                                    </select>
                                </label>

                                <label className="flex flex-col">
                                    <span className="text-sm">Estado de Conservação</span>
                                    <select
                                        name="estado_conservacao"
                                        value={editingBem.estado_conservacao ?? ""}
                                        onChange={handleChange}
                                        className="border rounded px-2 py-1"
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="Novo">Novo</option>
                                        <option value="Bom">Bom</option>
                                        <option value="Regular">Regular</option>
                                        <option value="Ruim">Ruim</option>
                                        <option value="Inservível">Inservível</option>
                                    </select>
                                </label>

                                <label className="flex flex-col">
                                    <span className="text-sm">Valor Aquisição</span>
                                    <input
                                        name="valor_aquisicao"
                                        type="number"
                                        value={editingBem.valor_aquisicao ?? ""}
                                        min="0"
                                        onChange={handleChange}
                                        className="border rounded px-2 py-1"
                                        onBlur={(e) => {
                                            let value = parseFloat(e.target.value);
                                            if (!isNaN(value)) {
                                                e.target.value = value.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
                                                handleChange(e);
                                            }
                                        }}
                                        step={0.01}
                                    />
                                </label>

                                <label className="flex flex-col">
                                    <span className="text-sm">Valor Residual</span>
                                    <input
                                        name="valor_residual"
                                        type="number"
                                        value={editingBem.valor_residual ?? ""}
                                        min="0"
                                        onChange={handleChange}
                                        className="border rounded px-2 py-1"
                                        disabled={!editingBem.valor_aquisicao}
                                        onBlur={(e) => {
                                            let value = parseFloat(e.target.value);
                                            if (!isNaN(value)) {
                                                e.target.value = value.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
                                                handleChange(e);
                                            }
                                        }}
                                        step={0.01}
                                    />
                                </label>

                                <label className="flex flex-col">
                                    <span className="text-sm">Depreciação (%)</span>
                                    <input
                                        name="depreciacao_percent"
                                        type="number"
                                        value={editingBem.depreciacao_percent ?? ""}
                                        onChange={handleChange}
                                        className="border rounded px-2 py-1"
                                        max={100}
                                        step={0.01}
                                        min={0}
                                    />
                                </label>

                                <label className="flex flex-col">
                                    <span className="text-sm">Data Aquisição</span>
                                    <input
                                        name="data_aquisicao"
                                        type="date"
                                        value={editingBem.data_aquisicao ?? ""}
                                        max={toInputDate(new Date().toISOString())}
                                        onChange={handleChange}
                                        className="border rounded px-2 py-1"
                                    />
                                </label>

                                <label className="flex flex-col">
                                    <span className="text-sm">Data Baixa</span>
                                    <input
                                        name="data_baixa"
                                        type="date"
                                        value={editingBem.data_baixa ?? ""}
                                        min={editingBem.data_aquisicao}
                                        disabled={!editingBem.data_aquisicao}
                                        onChange={handleChange}
                                        className="border rounded px-2 py-1"
                                    />
                                </label>

                                <label className="flex flex-col md:col-span-2">
                                    <span className="text-sm">Descrição</span>
                                    <textarea
                                        name="descricao_do_bem"
                                        value={editingBem.descricao_do_bem ?? ""}
                                        onChange={handleChange}
                                        className="border rounded px-2 py-1 resize-y min-h-[80px]"
                                        placeholder="Digite no máximo 200 caracteres..."
                                        maxLength={200}
                                    />
                                    <p className="text-xs text-gray-500">{editingBem.descricao_do_bem?.length ?? 0}/200</p>
                                </label>

                                <label className="flex flex-col md:col-span-2">
                                    <span className="text-sm">Justificativa Baixa</span>
                                    <select
                                        name="justificativa_baixa"
                                        value={editingBem.justificativa_baixa ?? ""}
                                        onChange={handleChange}
                                        className="border rounded px-2 py-1"
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="Obsoleto">Obsoleto</option>
                                        <option value="Danificado">Danificado</option>
                                        <option value="Perda">Perda</option>
                                        <option value="Doação">Doação</option>
                                        <option value="Venda">Venda</option>
                                    </select>
                                </label>
                            </div>




                            <div className="mt-6 flex justify-end space-x-3">
                                <button className="px-4 py-2 rounded border" onClick={closeModal} disabled={saving}>
                                    Cancelar
                                </button>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleSave} disabled={saving}>
                                    {saving ? "Salvando..." : "Salvar"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
