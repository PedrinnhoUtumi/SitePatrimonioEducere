import { useState } from "react";
import { EyeIcon, EyeClosedIcon } from "lucide-react";
import Foot from "../componentes/Footer";
import MenuTop from "../componentes/menuTop";
import { CONFIG } from "../config";

export default function Cadastro() {
    const [cpf, setCpf] = useState("");
    const [rg, setRg] = useState("");
    const [email, setEmail] = useState("");
    const [nome, setNome] = useState("");
    const [senha, setSenha] = useState("");
    const [type, setType] = useState("");
    const [loading, setLoading] = useState(false);
    const [erroSenha, setErroSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const [photoPreview, setPhotoPreview] = useState(null); 
    const [photo, setPhoto] = useState(null); 

    const user = JSON.parse(localStorage.getItem("user"));
    const created_by = user?.nome || "Usuário não reconhecido";

    const validarSenha = (senha) => {
        const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-={}[\]:;"'<>,.?/]).{8,}$/;
        return regex.test(senha);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validarSenha(senha)) {
            setErroSenha(
                "A senha deve ter no mínimo 8 caracteres, uma letra maiúscula e um caractere especial."
            );
            return;
        } else {
            setErroSenha("");
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("cpf", cpf);
            formData.append("rg", rg);
            formData.append("email", email);
            formData.append("nome", nome);
            formData.append("senha", senha);
            formData.append("type", type);
            formData.append("created_by", created_by);
            formData.append("photo", photo);

            const response = await fetch(`${CONFIG.API_URL}/users/cadastro`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Erro no cadastro: " + response.status);

            await response.json();
            alert("Usuário cadastrado com sucesso!");

            setCpf("");
            setRg("");
            setEmail("");
            setNome("");
            setSenha("");
            setType("");
            setPhotoPreview(null);
            setPhoto(null);

        } catch (err) {
            console.error("Erro ao cadastrar usuário:", err);
            alert("Erro ao cadastrar usuário. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#2f4a5a] via-[#253544] to-[#0b1620]">
            <MenuTop />

            <main className="flex flex-1 justify-center items-center p-6">
                <div className="relative w-full max-w-md">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                        <div
                            className="relative rounded-2xl p-8 md:p-10"
                            style={{
                                border: "1px solid rgba(255,255,255,0.03)",
                                boxShadow:
                                    "inset 0 12px 32px rgba(0,0,0,0.75), 0 8px 18px rgba(0,0,0,0.3)",
                            }}
                        >
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4 z-10 relative">
                                <h1 className="text-white text-lg font-medium">Criar usuário</h1>
                                <p className="text-slate-300 text-sm mb-4">Preencha os dados abaixo</p>

                                <label className="text-slate-200 text-sm">CPF</label>
                                <input
                                    value={cpf}
                                    onChange={(e) => {
                                        const onlyNums = e.target.value.replace(/\D/g, "");
                                        if (onlyNums.length <= 11) setCpf(onlyNums);
                                    }}
                                    placeholder="Somente números"
                                    maxLength={11}
                                    className="w-full rounded-xl bg-white px-4 py-3"
                                />

                                <label className="text-slate-200 text-sm">RG</label>
                                <input
                                    value={rg}
                                    onChange={(e) => {
                                        const onlyNums = e.target.value.replace(/\D/g, "");
                                        if (onlyNums.length <= 9) setRg(onlyNums);
                                    }}
                                    placeholder="Somente números"
                                    maxLength={9}
                                    className="w-full rounded-xl bg-white px-4 py-3"
                                />

                                <label className="text-slate-200 text-sm">Email</label>
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    placeholder="seu@email.com"
                                    className="w-full rounded-xl bg-white px-4 py-3"
                                />

                                <label className="text-slate-200 text-sm">Tipo de Usuário</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="w-full rounded-xl bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2"
                                >
                                    <option value="">Selecione...</option>
                                    <option value="Administrador">Administrador</option>
                                    <option value="Visualizador">Visualizador</option>
                                </select>

                                <label className="text-slate-200 text-sm">Nome</label>
                                <input
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    placeholder="Nome completo"
                                    className="w-full rounded-xl bg-white px-4 py-3"
                                />

                                <label className="text-slate-200 text-sm">Foto de perfil</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="file"
                                        id="upload-photo"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setPhoto(file);
                                                setPhotoPreview(URL.createObjectURL(file));
                                            }
                                        }}
                                    />
                                    <label
                                        htmlFor="upload-photo"
                                        className="cursor-pointer px-3 py-2 text-sm rounded-lg bg-indigo-600 hover:bg-indigo-500 transition text-white"
                                    >
                                        Upload Photo
                                    </label>

                                    {photoPreview && (
                                        <img
                                            src={photoPreview}
                                            alt="Preview"
                                            className="w-12 h-12 rounded-full object-cover border"
                                        />
                                    )}
                                </div>

                                <label className="text-slate-200 text-sm">Senha</label>
                                <div className="relative">
                                    <input
                                        value={senha}
                                        onChange={(e) => setSenha(e.target.value)}
                                        type={mostrarSenha ? "text" : "password"}
                                        placeholder="Senha12#"
                                        className="w-full rounded-xl bg-white px-4 py-3 pr-12"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setMostrarSenha(!mostrarSenha)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600"
                                    >
                                        {mostrarSenha ? <EyeIcon size={20} /> : <EyeClosedIcon size={20} />}
                                    </button>
                                </div>
                                {erroSenha && (
                                    <span className="text-xs text-red-400">{erroSenha}</span>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-4 w-full rounded-xl py-3 text-white font-medium uppercase tracking-wide transition disabled:opacity-60"
                                    style={{
                                        background: "linear-gradient(180deg, #3b5a72, #2f4a5a)",
                                        boxShadow:
                                            "inset 0 -3px 8px rgba(0,0,0,0.35), 0 6px 14px rgba(2,6,23,0.5)",
                                    }}
                                >
                                    {loading ? "Enviando..." : "Enviar"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            <Foot />
        </div>
    );
}
