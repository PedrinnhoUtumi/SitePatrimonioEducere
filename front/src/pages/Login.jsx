import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CONFIG } from "../config";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState(false);

    localStorage.clear()

    useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
        navigate("/bens", { replace: true });
    }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
        const response = await fetch(`${CONFIG.API_URL}/users/login`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            email,
            senha: password,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.message || `Falha no login: ${response.status}`);
        }

        if (data.token) localStorage.setItem("token", data.token);
        // localStorage.setItem("user", JSON.stringify({ id: data.user.id_user, type: data.user.type, nome: data.user.nome, photo: data.user.photo }));
        localStorage.setItem("user", JSON.stringify({ id: data.user.id_user, type: data.user.type, nome: data.user.nome }));
        localStorage.setItem("usuario", "𝔾𝕆𝕆𝔻 𝔹𝕆𝕐");
        
        navigate("/bens");

        } catch (err) {
            console.error("Erro no login:", err);
            alert(err.message || "Erro no login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2f4a5a] via-[#253544] to-[#0b1620] p-6">
        <div className="relative w-full max-w-md">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <form onSubmit={handleSubmit} className="relative z-10 p-8 md:p-10 flex flex-col gap-4">
                <label className="text-gray-200 font-medium">Email:</label>
                <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="seu@email.com"
                className="w-full rounded-xl bg-white/90 text-gray-800 placeholder-gray-500 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
                />

                <label className="mt-2 text-gray-200 font-medium">Senha:</label>
                <div className="relative">
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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

                <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full rounded-xl py-3 bg-[#3b5a72] text-white font-medium disabled:opacity-60 shadow-inner"
                >
                {loading ? "Enviando..." : "Entrar"}
                </button>
            </form>

            <div
                className="pointer-events-none absolute inset-0 rounded-2xl"
                style={{
                boxShadow: "0 10px 30px rgba(2,6,23,0.7) inset, 0 18px 40px rgba(2,6,23,0.6)",
                }}
            />
            </div>
        </div>
        </div>
    );
}
