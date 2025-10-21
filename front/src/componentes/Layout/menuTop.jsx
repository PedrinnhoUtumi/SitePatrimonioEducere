import { useState } from "react";
import {
    Archive,
    Calendar,
    CircleUserIcon,
    Eraser,
    EyeClosedIcon,
    EyeIcon,
    LogOutIcon,
    Menu,
    UserPlus2,
    X,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { CONFIG } from "../../config";

export function MenuTop() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [openEditor, setOpenEditor] = useState(false);
    const [previewPhoto, setPreviewPhoto] = useState(null);
    const [mostrarSenha, setMostrarSenha] = useState(null);
    const [erroSenha, setErroSenha] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));
    const userType = user?.type || "Visualizador";
    const userName = user?.nome || "Erro";
    const ID = user?.id;
    const CPF = user?.cpf;
    const RG = user?.rg;
    const email = user?.email || "Erro";
    const userPhoto = user?.photo || null;

    const [updatedUser, setUpdatedUser] = useState({
        id: ID || "",
        nome: userName,
        cpf: CPF,
        rg: RG,
        photo: previewPhoto,
        senha: "",
        email: email,
    });

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/", { replace: true });
    };

    const handleOpenEditor = () => {
        setOpenEditor(!openEditor);
        console.log(CPF, RG);
    };
    const validarSenha = (senha) => {
        const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-={}[\]:;"'<>,.?/]).{8,}$/;
        return regex.test(senha);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (updatedUser.senha && !validarSenha(updatedUser.senha)) {
            setErroSenha(
                "A senha deve ter no mínimo 8 caracteres, uma letra maiúscula e um caractere especial."
            );
            return;
        }
        setErroSenha("");
        setLoading(true);

        try {
            if (!updatedUser.id) {
                alert("ID do usuário não definido. Recarregue a página.");
                setLoading(false);
                return;
            }

            const formData = new FormData();
            formData.append("id", updatedUser.id);
            formData.append("nome", updatedUser.nome);
            formData.append("cpf", updatedUser.cpf);
            formData.append("rg", updatedUser.rg);
            formData.append("email", updatedUser.email);

            if (updatedUser.senha) formData.append("senha", updatedUser.senha);

            if (updatedUser.photo && typeof updatedUser.photo !== "string") {
                formData.append("photo", updatedUser.photo);
            }

            const response = await fetch(`${CONFIG.API_URL}/users/update`, {
                method: "PUT",
                body: formData,
            });

            if (!response.ok) throw new Error("Erro no cadastro");

            const data = await response.json();
            localStorage.setItem("user", JSON.stringify(data.user));

            alert("Usuário atualizado com sucesso!");

            setUpdatedUser((prev) => ({
                ...prev,
                senha: "",
                photo: prev.photo && typeof prev.photo !== "string" ? prev.photo : prev.photo || user.photo,
            }));

            setPreviewPhoto(null);
            window.location.reload()

        } catch (err) {
            console.error("Erro ao cadastrar usuário:", err);
            alert("Erro ao cadastrar usuário. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <header className="w-full bg-gray-900 text-white shadow-[0_2px_6px_rgba(0,0,0,0.15)] relative z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                <NavLink to="/bens" className="text-lg font-bold tracking-wide">
                    Controle Patrimonial
                </NavLink>

                <button
                    className="md:hidden p-2"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                <nav className="hidden md:flex items-center gap-6">
                    <Link
                        to="/bens"
                        className="hover:text-indigo-400 transition"
                        title="Bens"
                    >
                        <Archive />
                    </Link>
                    <Link
                        to="/salas"
                        className="hover:text-indigo-400 transition"
                        title="Salas"
                    >
                        <Calendar />
                    </Link>
                    {userType === "Administrador" && (
                        <Link
                            to="/cadastro"
                            className="hover:text-indigo-400 transition"
                            title="Cadastro"
                        >
                            <UserPlus2 />
                        </Link>
                    )}
                    {userType === "Administrador" && (
                        <Link
                            to="/delete"
                            className="hover:text-indigo-400 transition"
                        >
                            <Eraser />
                        </Link>

                    )}
                    <button
                        onClick={handleLogout}
                        className="hover:text-indigo-400 transition"
                        title="Sair"
                    >
                        <LogOutIcon />
                    </button>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-gray-800 text-blue-300">
                        {userPhoto ? (
                            <img
                                src={`http://localhost:3001/imagens/${user.photo}`}
                                alt="Foto de perfil"
                                className="w-8 h-8 rounded-full object-cover cursor-pointer"
                                onClick={handleOpenEditor}
                            />
                        ) : (
                            <CircleUserIcon size={28} onClick={handleOpenEditor} className="cursor-pointer" />
                        )}
                        <span className="font-semibold">{userName}</span>
                    </div>
                    {openEditor && (
                        <>
                            <div
                                className="fixed inset-0 bg-black bg-opacity-30 z-40"
                                onClick={() => setOpenEditor(false)}
                            ></div>

                            <form
                                className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 bg-white text-black rounded-lg shadow-lg p-6 w-11/12 max-w-md max-h-[80vh] overflow-auto"
                                style={{ minWidth: "280px" }}
                                onSubmit={handleSubmit}
                            >
                                <h2 className="font-semibold text-lg mb-4">
                                    Preencha os dados abaixo para atualizar o perfil
                                </h2>

                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium mb-1">CPF</label>
                                        <input
                                            value={updatedUser.cpf}
                                            onChange={(e) =>
                                                setUpdatedUser((prev) => ({
                                                    ...prev,
                                                    cpf: e.target.value,
                                                }))
                                            }
                                            maxLength={11}
                                            type="text"
                                            placeholder="Somente números"
                                            className="p-2 rounded-md border"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium mb-1">RG</label>
                                        <input
                                            value={updatedUser.rg}
                                            onChange={(e) =>
                                                setUpdatedUser((prev) => ({
                                                    ...prev,
                                                    rg: e.target.value,
                                                }))
                                            }
                                            type="text"
                                            placeholder="Somente números"
                                            className="p-2 rounded-md border"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium mb-1">Email</label>
                                        <input
                                            value={updatedUser.email}
                                            onChange={(e) =>
                                                setUpdatedUser((prev) => ({
                                                    ...prev,
                                                    email: e.target.value,
                                                }))
                                            }
                                            type="email"
                                            placeholder="seu@email.com"
                                            className="p-2 rounded-md border"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium mb-1">Nome</label>
                                        <input
                                            value={updatedUser.nome}
                                            onChange={(e) =>
                                                setUpdatedUser((prev) => ({
                                                    ...prev,
                                                    nome: e.target.value,
                                                }))
                                            }
                                            type="text"
                                            placeholder="Nome completo"
                                            className="p-2 rounded-md border"
                                        />
                                    </div>

                                    <div className="flex flex-col relative">
                                        <label className="text-sm font-medium mb-1">Senha</label>
                                        <input
                                            value={updatedUser.senha || ""}
                                            onChange={(e) =>
                                                setUpdatedUser((prev) => ({
                                                    ...prev,
                                                    senha: e.target.value,
                                                }))
                                            }
                                            type={mostrarSenha ? "text" : "password"}
                                            placeholder="Senha12#"
                                            className="p-2 rounded-md border pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setMostrarSenha(!mostrarSenha)}
                                            className="absolute right-3 top-9 text-gray-600"
                                        >
                                            {mostrarSenha ? (
                                                <EyeIcon size={20} />
                                            ) : (
                                                <EyeClosedIcon size={20} />
                                            )}
                                        </button>
                                    </div>
                                    {erroSenha && (
                                        <span className="text-xs text-red-400">{erroSenha}</span>
                                    )}

                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium mb-1">
                                            Foto de perfil
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onload = () => setPreviewPhoto(reader.result);
                                                    reader.readAsDataURL(file);
                                                    setUpdatedUser((prev) => ({ ...prev, photo: file }));
                                                }
                                            }}
                                            className="text-sm"
                                        />
                                        {previewPhoto || userPhoto ? (
                                            <img
                                                src={
                                                    previewPhoto ||
                                                    `http://localhost:3001/imagens/${user.photo}`
                                                }
                                                alt="Preview"
                                                className="w-20 h-20 rounded-full object-cover border mt-2 mx-auto"
                                            />
                                        ) : null}
                                    </div>

                                    <div className="flex justify-between gap-3 mt-4">
                                        <button
                                            onClick={() => setOpenEditor(false)}
                                            type="button"
                                            className="flex-1 text-white border bg-red-600 hover:text-red-600 hover:border-red-600 hover:bg-red-200 py-2 rounded transition"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            disabled={loading}
                                            type="submit"
                                            className="flex-1 bg-blue-600 border text-white hover:text-blue-600 hover:border-blue-600 hover:bg-blue-200 py-2 rounded transition"
                                        >
                                            {loading ? "Salvando..." : "Salvar"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </>
                    )}
                </nav>
            </div>

            {menuOpen && (
                <nav className="md:hidden bg-gray-800 flex flex-col items-center gap-4 py-6 px-4 text-center">
                    <Link
                        to="/bens"
                        onClick={() => setMenuOpen(false)}
                        className="hover:text-indigo-400 transition text-lg font-medium"
                    >
                        <div className="flex items-center gap-2">
                            <Archive size={20} /> Bens
                        </div>
                    </Link>
                    <Link
                        to="/salas"
                        onClick={() => setMenuOpen(false)}
                        className="hover:text-indigo-400 transition text-lg font-medium"
                    >
                        <div className="flex items-center gap-2">
                            <Calendar size={20} /> Salas
                        </div>
                    </Link>
                    {userType === "Administrador" && (
                        <Link
                            to="/cadastro"
                            onClick={() => setMenuOpen(false)}
                            className="hover:text-indigo-400 transition text-lg font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <UserPlus2 size={20} /> Cadastro
                            </div>
                        </Link>
                    )}
                    <div className="flex items-center gap-2 text-blue-300 mt-2">
                        {userPhoto ? (
                            <img
                                src={`http://localhost:3001/imagens/${user.photo}`}
                                alt="Foto de perfil"
                                className="w-8 h-8 rounded-full object-cover"
                                onClick={handleOpenEditor}
                            />
                        ) : (
                            <CircleUserIcon size={28} onClick={handleOpenEditor} />
                        )}
                        <span className="font-semibold">{userName}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="hover:text-red-400 transition mt-2 text-sm"
                    >
                        <LogOutIcon size={18} className="inline mr-1" /> Sair
                    </button>
                </nav>
            )}
        </header>
    );
}
