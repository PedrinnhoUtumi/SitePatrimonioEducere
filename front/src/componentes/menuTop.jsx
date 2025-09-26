import { useState } from "react";
import { Archive, Calendar, CircleUserIcon, LogOutIcon, Menu, UserPlus2, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function MenuTop() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate()

    const user = JSON.parse(localStorage.getItem("user"));
    const userType = user?.type || "Visualizador"; 
    const userName = user?.nome || "Erro"

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/", { replace: true });
    };

    return (
        <header className="w-full bg-gray-900 text-white shadow-[0_2px_6px_rgba(0,0,0,0.15)] relative z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                
                <button
                    className="md:hidden p-2"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                <h1 className="text-lg font-bold tracking-wide 
                            md:static md:translate-x-0 
                            absolute left-1/2 -translate-x-1/2 md:left-0">
                    Controle Patrimonial
                </h1>

                <nav className="hidden md:flex items-center gap-6">
                    <Link to="/bens" className="hover:text-indigo-400 transition"><Archive/></Link>
                    <Link to="/salas" className="hover:text-indigo-400 transition"><Calendar/></Link>
                    {userType === "Administrador" && (
                        <Link to="/cadastro" className="hover:text-indigo-400 transition"><UserPlus2/></Link>
                    )}
                    <button onClick={handleLogout} className="hover:text-indigo-400 transition"><LogOutIcon/></button>
                    <div className="flex items-center gap-4 p-4 w-full max-w-md rounded-xl shadow-md bg-gray-900 text-blue-600">
                        <div className="text-blue-600 bg-blue-100 rounded-full">
                            <CircleUserIcon size={32} />
                        </div>
                        <span className="text-lg font-semibold">{userName}</span>
                    </div>
                </nav>
            </div>  

            {menuOpen && (
                <nav className="md:hidden bg-gray-800 flex flex-col items-center gap-4 py-4">
                    <Link 
                        to="/bens" 
                        className="hover:text-indigo-400 transition" 
                        onClick={() => setMenuOpen(false)}
                    >
                        Bens
                    </Link>
                    <Link 
                        to="/salas" 
                        className="hover:text-indigo-400 transition" 
                        onClick={() => setMenuOpen(false)}
                    >
                        Salas Reservadas
                    </Link>
                    {userType === "Administrador" && (
                        <Link 
                            to="/cadastro" 
                            className="hover:text-indigo-400 transition" 
                            onClick={() => setMenuOpen(false)}
                        >
                            Cadastro
                        </Link>
                    )}
                    <div>
                        {userName}
                    </div>
                    <button 
                        onClick={handleLogout} 
                        className="hover:text-indigo-400 transition"
                    >
                        Sair
                    </button>
                </nav>
            )}
        </header>
    );
}
