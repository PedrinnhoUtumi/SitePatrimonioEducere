import { useState } from "react";
import {
    EyeIcon,
    EyeClosedIcon,
    CircleUserIcon,
    MenuIcon,
    Archive,
    Calendar,
    UserPlus2,
    LogOutIcon,
    X,
    Eraser,
} from "lucide-react";
import { CONFIG } from "../../config";
import { Link, useNavigate } from "react-router-dom";

export function Cadastro() {
    const navigate = useNavigate();

    const [cpf, setCpf] = useState("");
    const [rg, setRg] = useState("");
    const [email, setEmail] = useState("");
    const [nome, setNome] = useState("");
    const [senha, setSenha] = useState("");
    const [type, setType] = useState("");
    const [loading, setLoading] = useState(false);
    const [erroSenha, setErroSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [abrirMenu, setAbrirMenu] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [photo, setPhoto] = useState(null);

    const user = JSON.parse(localStorage.getItem("user"));
    const created_by = user?.nome || "Usuário não reconhecido";
    const userType = user?.type || "Visualizador";
    const year = new Date().getFullYear();

    const validarSenha = (senha) => {
        const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-={}[\]:;"'<>,.?/]).{8,}$/;
        return regex.test(senha);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/", { replace: true });
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
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#2f4a5a] via-[#253544] to-[#0b1620] relative text-white overflow-x-hidden">

            <button
                onClick={() => setAbrirMenu(!abrirMenu)}
                className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-black/70 hover:bg-black/90 text-white transition-all duration-300 shadow-md"
            >
                {abrirMenu ? <X size={26} className="hover:text-red-400" /> : <MenuIcon size={26} className="hover:text-blue-400" />}
            </button>

            <nav
                className={`
                    fixed top-0 left-0 h-full w-64
                    bg-gray-900 text-white shadow-2xl rounded-r-3xl
                    transform transition-transform duration-300 ease-in-out
                    ${abrirMenu ? "translate-x-0" : "-translate-x-full"}
                    flex flex-col justify-between p-6 z-40
                `}
            >
                <div className="flex flex-col gap-8 mt-10">
                    <Link
                        to="/bens"
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-800 hover:text-indigo-400 transition"
                        onClick={() => setAbrirMenu(false)}
                    >
                        <Archive /> <span>Bens</span>
                    </Link>

                    <Link
                        to="/salas"
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-800 hover:text-indigo-400 transition"
                        onClick={() => setAbrirMenu(false)}
                    >
                        <Calendar /> <span>Salas</span>
                    </Link>

                    {userType === "Administrador" && (
                        <Link
                            to="/cadastro"
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-800 hover:text-indigo-400 transition"
                            onClick={() => setAbrirMenu(false)}
                        >
                            <UserPlus2 /> <span>Cadastrar Usuário</span>
                        </Link>
                    )}
                    {userType === "Administrador" && (
                        <Link
                            to="/delete"
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-800 hover:text-indigo-400 transition"
                            onClick={() => setAbrirMenu(false)}
                        >
                            <Eraser /> <span>Deletar</span>
                        </Link>
                    )}
                </div>

                <footer className="mt-auto border-t border-gray-700 pt-5 flex flex-col items-center gap-3 text-gray-400 text-xs">

                    <div className="flex flex-col items-center gap-2">
                        <div className="px-3 py-1 rounded-lg bg-gray-800/60 text-blue-300 text-sm font-semibold shadow-inner">
                            {created_by}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg 
                            bg-red-600 text-white text-sm shadow-md 
                            border border-red-600/0 
                            hover:border-red-600 hover:bg-white hover:text-red-600 
                            transition-all duration-200"
                            title="Sair"
                        >
                            <LogOutIcon size={16} />
                            <span>Sair</span>
                        </button>
                    </div>

                    <div className="flex items-center justify-center gap-2 mt-2 text-[11px] text-gray-500 flex-wrap">
                        <a
                            href="https://github.com/saraqwe123"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-indigo-400 transition"
                        >
                            &lt;saraqwe123/&gt;
                        </a>
                        <a
                            href="https://github.com/brunpena"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-indigo-400 transition"
                        >
                            &lt;brunpena/&gt;
                        </a>
                        <a
                            href="https://github.com/PedrinnhoUtumi"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-indigo-400 transition"
                        >
                            &lt;PedrinnhoUtumi/&gt;
                        </a>
                    </div>

                    <div className="text-[10px] text-gray-600 mt-1 mb-1 text-center">
                        © {year} Fundação Educere
                    </div>
                </footer>

            </nav>

            <main className="flex flex-1 justify-center items-center p-6">
                <div className="relative w-full max-w-md sm:max-w-lg md:max-w-xl">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-xl border border-white/10 p-8 md:p-10">
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-4 z-10 relative text-sm"
                        >
                            <h1 className="text-white text-lg font-semibold">
                                Criar Usuário
                            </h1>
                            <p className="text-slate-300 text-sm mb-4">
                                Preencha os dados abaixo
                            </p>

                            <label className="text-slate-200 text-sm">CPF</label>
                            <input
                                value={cpf}
                                onChange={(e) => {
                                    const onlyNums = e.target.value.replace(/\D/g, "");
                                    if (onlyNums.length <= 11) setCpf(onlyNums);
                                }}
                                placeholder="Somente números"
                                className="w-full rounded-xl bg-white px-4 py-3 text-gray-800"
                            />

                            <label className="text-slate-200 text-sm">RG</label>
                            <input
                                value={rg}
                                onChange={(e) => {
                                    const onlyNums = e.target.value.replace(/\D/g, "");
                                    if (onlyNums.length <= 9) setRg(onlyNums);
                                }}
                                placeholder="Somente números"
                                className="w-full rounded-xl bg-white px-4 py-3 text-gray-800"
                            />

                            <label className="text-slate-200 text-sm">Email</label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                placeholder="seu@email.com"
                                className="w-full rounded-xl bg-white px-4 py-3 text-gray-800"
                            />

                            <label className="text-slate-200 text-sm">Tipo de Usuário</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full rounded-xl bg-white px-4 py-3 text-gray-800"
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
                                className="w-full rounded-xl bg-white px-4 py-3 text-gray-800"
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
                                    className="cursor-pointer px-3 py-2 w-20 h-20 flex justify-center border hover:border-blue-600 hover:text-blue-600 items-center text-sm rounded-full bg-blue-600 hover:bg-white transition text-white"
                                >
                                    {photoPreview ? (
                                        <img
                                            src={photoPreview}
                                            alt="Preview"
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <CircleUserIcon className="object-contain w-20 h-20" />
                                    )}
                                </label>
                            </div>

                            <label className="text-slate-200 text-sm">Senha</label>
                            <div className="relative">
                                <input
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    type={mostrarSenha ? "text" : "password"}
                                    placeholder="Senha12#"
                                    className="w-full rounded-xl bg-white px-4 py-3 pr-12 text-gray-800"
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
                                className="mt-4 w-full rounded-xl py-3 text-white font-medium uppercase tracking-wide transition disabled:opacity-60 bg-gradient-to-b from-blue-700 to-blue-900 hover:from-blue-600 hover:to-blue-800"
                            >
                                {loading ? "Enviando..." : "Enviar"}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
