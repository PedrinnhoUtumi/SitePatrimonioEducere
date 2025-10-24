import React, { useContext, useState } from "react";
import { CONFIG } from "../../config";
import { NumericFormat } from "react-number-format";
import { DadosContext } from "../../context/DadosContext";


export function AdicionaBem() {
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

    const { dados } = useContext(DadosContext);

    const [form, setForm] = useState({
        categoria: "Equipamentos",
        descricao: "",
        data_Aquisicao: "",
        data_Baixa: "",
        justificativaBaixa: "Transferência",
        // depreciacao: "",
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

        // const dep = parseFloat(form.depreciacao);
        // if (isNaN(dep) || dep < 0 || dep > 100) {
        //     errors.push("Depreciação deve ser uma porcentagem entre 0 e 100.");
        // }

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
            depreciacao_percent: ((form.valorAquisicao - form.valorResidual) / form.valorResidual) * 100,
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
                // depreciacao: "",
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

                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700">Depreciação anual (%)</label>
                        <NumericFormat
                            value={form.depreciacao}
                            onValueChange={(values) => {
                                let { value } = values;
                                if (value > 100) {    
                                    value = 100;
                                }
                                setForm({ ...form, depreciacao: value });
                            }}
                            thousandSeparator="."
                            decimalSeparator=","
                            suffix="%"
                            allowNegative={false}
                            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                            decimalScale={2}
                        />
                    </div> */}
                </div>

                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Valor da aquisição</label>
                        <NumericFormat
                            value={form.valorAquisicao}
                            onValueChange={(values) => {
                                const { value } = values;
                                setForm({ ...form, valorAquisicao: value });
                            }}
                            thousandSeparator="."
                            decimalSeparator=","
                            prefix="R$ "
                            allowNegative={false}
                            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                            decimalScale={2}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Valor residual</label>
                        <NumericFormat
                            value={form.valorResidual}
                            onValueChange={(values) => {
                                const { value } = values;
                                setForm({ ...form, valorResidual: value });
                            }}
                            thousandSeparator="."
                            decimalSeparator=","
                            prefix="R$ "
                            allowNegative={false}
                            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                            decimalScale={2}
                            disabled={!form.valorAquisicao}
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
                            {dados.salas.map((sala) => (
                                <option key={sala.id_sala} >
                                    {sala.nome_sala}
                                </option>
                            ))}
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
