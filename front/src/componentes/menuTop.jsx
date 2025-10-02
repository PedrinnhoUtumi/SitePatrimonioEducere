import { useState } from "react";
import { Archive, Calendar, CircleUserIcon, LogOutIcon, Menu, UserPlus2, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function MenuTop() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));
    const userType = user?.type || "Visualizador";
    const userName = user?.nome || "Erro";
    const userPhoto = user?.photo || null;

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/", { replace: true });
    };

    return (
        <header className="w-full bg-gray-900 text-white shadow-[0_2px_6px_rgba(0,0,0,0.15)] relative z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                <h1 className="text-lg font-bold tracking-wide">Controle Patrimonial</h1>

                <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                <nav className="hidden md:flex items-center gap-6">
                    <Link to="/bens" className="hover:text-indigo-400 transition" title="Bens"><Archive /></Link>
                    <Link to="/salas" className="hover:text-indigo-400 transition" title="Salas"><Calendar /></Link>
                    {userType === "Administrador" && (
                        <Link to="/cadastro" className="hover:text-indigo-400 transition" title="Cadastro"><UserPlus2 /></Link>
                    )}
                    <button onClick={handleLogout} className="hover:text-indigo-400 transition" title="Sair"><LogOutIcon /></button>

                    <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-gray-800 text-blue-300">
                        <CircleUserIcon size={28} />
                        <span className="text-sm font-medium">{userName}</span>
                    </div>
                </nav>
            </div>

            {menuOpen && (
                <nav className="md:hidden bg-gray-800 flex flex-col items-center gap-4 py-6 px-4 text-center">
                    <Link to="/bens" onClick={() => setMenuOpen(false)} className="hover:text-indigo-400 transition text-lg font-medium">
                        <div className="flex items-center gap-2"><Archive size={20} /> Bens</div>
                    </Link>
                    <Link to="/salas" onClick={() => setMenuOpen(false)} className="hover:text-indigo-400 transition text-lg font-medium">
                        <div className="flex items-center gap-2"><Calendar size={20} /> Salas</div>
                    </Link>
                    {userType === "Administrador" && (
                        <Link to="/cadastro" onClick={() => setMenuOpen(false)} className="hover:text-indigo-400 transition text-lg font-medium">
                            <div className="flex items-center gap-2"><UserPlus2 size={20} /> Cadastro</div>
                        </Link>
                    )}
                    <div className="flex items-center gap-2 text-blue-300 mt-2">
                        {userPhoto ? (
                            <img
                                src={userPhoto}
                                alt="Foto de perfil"
                                className="w-8 h-8 rounded-full object-cover"
                            />
                        ) : (
                            <CircleUserIcon size={28} />
                        )}
                        <span className="font-semibold">{userName}</span>
                    </div>
                    <button onClick={handleLogout} className="hover:text-red-400 transition mt-2 text-sm">
                        <LogOutIcon size={18} className="inline mr-1" /> Sair
                    </button>
                </nav>
            )}
        </header>
    );
}
