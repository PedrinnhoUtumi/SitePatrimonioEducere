import React, { useState } from "react";
import { CONFIG } from "../../config";
import { Form } from "react-router-dom";

export function AdcionaBem() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    function dateToISO(dateStr) {
        if (!dateStr) return null;
        const parts = String(dateStr).split('-');
        if (parts.length !== 3) return null;

        const year = Number(parts[0]);
        const month = Number(parts[1]);
        const day = Number(parts[2]);

        if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return null;

        const dt = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
        if (Number.isNaN(dt.getTime())) return null;

        return dt.toISOString();
    }

    const [form, setForm] = useState({
        categoria: "Equipamentos",
        descricao: "",
        data_Aquisicao: "",
        data_Baixa: "",
        justificativaBaixa: "Transferência",
        depreciacao: "0",
        valorAquisicao: "",
        valorResidual: "",
        marca: "",
        localizacao_text: "Prototipagem",
        modelo: "",
        estado_conservacao: "Novo",
    });


    function handleChange(e) {
        const { name, value } = e.target;
        setForm((s) => ({ ...s, [name]: value }));
        setMessage(null);
    }

    function validate() {
        const errors = [];

        if (!form.descricao) errors.push("Descrição é obrigatória.");
        if (!form.data_Aquisicao) errors.push("Data de aquisição é obrigatória.");

        const va = parseFloat(form.valorAquisicao);
        const vr = parseFloat(form.valorResidual);
        if (isNaN(va) || va < 0) {
            errors.push("Valor da aquisição precisa ser um double >= 0.");
        }

        if (isNaN(vr) || vr < 0) {
            errors.push("Valor residual precisa ser um double >= 0.");
        }

        if (vr > va) {
            errors.push("Valor residual precisa ser menor que valor de aquisição.");
        }

        const dep = parseFloat(form.depreciacao);
        if (isNaN(dep) || dep < 0 || dep > 100) {
            errors.push("Depreciação deve ser uma porcentagem entre 0 e 100.");
        }

        return errors;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage(null);

        const errors = validate();
        if (errors.length > 0) {
            setMessage({ type: "error", text: errors.join(" ") });
            return;
        }

        const payload = {
            categoria: form.categoria,
            descricao_do_bem: form.descricao,
            data_aquisicao: dateToISO(form.data_Aquisicao),
            data_baixa: dateToISO(form.data_Baixa),
            justificativa_baixa: form.justificativaBaixa,
            depreciacao_percent: parseFloat(form.depreciacao),
            valor_aquisicao: parseFloat(form.valorAquisicao),
            valor_residual: parseFloat(form.valorResidual),
            marca: form.marca,
            localizacao_text: form.localizacao_text,
            id_sala: form.id_sala || null,
            modelo: form.modelo,
            estado_conservacao: form.estado_conservacao,
            id_user_responsavel: form.idUserResponsavel || null,
            idQrCode: null
        };

        setLoading(true);
        try {
            const res = await fetch(`${CONFIG.API_URL}/bem/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errText = await res.text().catch(() => null);
                throw new Error(errText || `Erro ${res.status}`);
            }

            setMessage({ type: "success", text: "Bem adicionado com sucesso." });
            setForm({
                categoria: "Equipamentos",
                descricao: "",
                data_Aquisicao: "",
                data_Baixa: "",
                justificativaBaixa: "Transferência",
                depreciacao: "",
                valorAquisicao: "",
                valorResidual: "",
                marca: "",
                localizacao_text: "Prototipagem",
                modelo: "",
                estado: "Novo",
            });
        } catch (err) {
            setMessage({ type: "error", text: "Falha ao enviar: " + err.message });
        } finally {
            setLoading(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-5xl mx-auto p-6 bg-white shadow-[inset_0_2px_10px_rgba(0,0,0,0.20)] rounded-2xl mb-10"
        >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Cadastro de Bem</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Categoria</label>
                        <select
                            name="categoria"
                            value={form.categoria}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                        >
                            <option>Equipamentos</option>
                            <option>Móveis</option>
                            <option>Máquinas</option>
                            <option>Veículos</option>
                            <option>Eletrodomésticos</option>
                            <option>Utensílios</option>
                            <option>Eletroeletônicos</option>
                            <option>Equipamentos de informática</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Descrição do bem</label>
                        <input
                            name="descricao"
                            value={form.descricao}
                            onChange={handleChange}
                            type="text"
                            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                            maxLength={200}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Data de aquisição</label>
                        <input
                            name="data_Aquisicao"
                            value={form.data_Aquisicao}
                            onChange={handleChange}
                            min="1997-10-01"
                            max={new Date().toISOString().split("T")[0]}
                            type="date"
                            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Data da baixa</label>
                        <input
                            name="data_Baixa"
                            value={form.data_Baixa}
                            onChange={handleChange}
                            min={form.data_Aquisicao}
                            disabled={!form.data_Aquisicao}
                            type="date"
                            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Justificativa da baixa</label>
                        <select
                            name="justificativaBaixa"
                            value={form.justificativaBaixa}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                        >
                            <option>Transferência</option>
                            <option>Cessão</option>
                            <option>Alienação (Venda)</option>
                            <option>Alienação (Permuta)</option>
                            <option>Alienação (Doação)</option>
                            <option>Destinação final ambientalmente adequada</option>
                            <option>Desaparecimento</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Depreciação anual (%)</label>
                        <input
                            name="depreciacao"
                            value={form.depreciacao}
                            onChange={handleChange}
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Valor da aquisição</label>
                        <input
                            name="valorAquisicao"
                            value={form.valorAquisicao}
                            onChange={handleChange}
                            type="number"
                            step="0.01"
                            min="0"
                            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                            onBlur={(e) => {
                                let value = parseFloat(e.target.value);
                                if (!isNaN(value)) {
                                    e.target.value = value.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
                                    handleChange(e);
                                }
                            }}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Valor residual</label>
                        <input
                            name="valorResidual"
                            value={form.valorResidual}
                            onChange={handleChange}
                            disabled={!form.valorAquisicao}
                            type="number"
                            step="0.01"
                            min="0"
                            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                            onBlur={(e) => {
                                let value = parseFloat(e.target.value);
                                if (!isNaN(value)) {
                                    e.target.value = value.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
                                    handleChange(e);
                                }
                            }}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Marca</label>
                        <input
                            name="marca"
                            value={form.marca}
                            onChange={handleChange}
                            type="text"
                            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Localização</label>
                        <select
                            name="localizacao_text"
                            value={form.localizacao_text}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                        >
                            <option>Prototipagem</option>
                            <option>Arquivo morto (Subsolo)</option>
                            <option>Sala 001 (Administrativo)</option>
                            <option>Sala 002 (Auditório)</option>
                            <option>Sala 003 (Magvia)</option>
                            <option>Sala 004 (Data Center)</option>
                            <option>Sala 005</option>
                            <option>Sala 006</option>
                            <option>Sala 007</option>
                            <option>Sala 101</option>
                            <option>Sala 102</option>
                            <option>Sala 103</option>
                            <option>Sala 104</option>
                            <option>Sala 105</option>
                            <option>Sala 106</option>
                            <option>Sala 107 (Modelagem de negócio)</option>
                            <option>Sala 108 (Coworking)</option>
                            <option>Sala 109 (Planejamento)</option>
                            <option>Sala 110 (Almoxerifado)</option>
                            <option>Sala 111 (Sala google)</option>
                            <option>Sala 112</option>
                            <option>Sala 113</option>
                            <option>Sala 114 (Estúdio)</option>
                            <option>Sala 115</option>
                            <option>Sala 201</option>
                            <option>Sala 202</option>
                            <option>Sala 203 (Lab. programação)</option>
                            <option>Sala 203 (Sala de treinamento)</option>
                            <option>Sala 204 (Lab. mecânica)</option>
                            <option>Sala 205 (Lab. Eletrônica)</option>
                            <option>Sala 206</option>
                            <option>Sala 207</option>
                            <option>Sala 208</option>
                            <option>Sala 209</option>
                            <option>Sala 210</option>
                            <option>Sala 211</option>
                            <option>Sala 212 (Lab. Ciências Aplicadas)</option>
                            <option>Sala 213</option>
                            <option>Copa Térreo</option>
                            <option>Copa Primeiro andar</option>
                            <option>Copa Segundo andar</option>
                            <option>Copa Terceiro andar (Cozinha 2)</option>
                            <option>Corredor Térreo</option>
                            <option>Corredor Primeiro andar</option>
                            <option>Corredor Segundo andar</option>
                            <option>Corredor/Churrasqueira Terceiro andar</option>
                            <option>DML Térreo</option>
                            <option>DML Primeiro andar</option>
                            <option>DML Segundo andar</option>
                            <option>DML Terceiro andar</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Modelo</label>
                        <input
                            name="modelo"
                            value={form.modelo}
                            onChange={handleChange}
                            type="text"
                            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Estado de conservação</label>
                        <select
                            name="estado_conservacao"
                            value={form.estado_conservacao}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                        >
                            <option>Novo</option>
                            <option>Usado recente</option>
                            <option>Anos de uso</option>
                            <option>Avariado</option>
                        </select>
                    </div>
                </div>
            </div>

            {message && (
                <div
                    className={`mt-4 p-3 rounded ${message.type === "error"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                        }`}
                >
                    {message.text}
                </div>
            )}

            <div className="mt-8 flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className={`px-6 py-2 ${loading ? "bg-gray-400" : "bg-blue-900 hover:bg-blue-700"
                        } text-white font-medium rounded-lg shadow transition`}
                >
                    {loading ? "Enviando..." : "Adicionar Bem"}
                </button>
            </div>
        </form>

    );
}
