import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: username, password }),
        });

        const data = await response.json();

        if (response.ok && data.token) {
            localStorage.setItem("token", data.token);
            navigate("/admin");
        } else {
            alert(data.error || "Login inválido");
        }
        } catch (error) {
            alert("Erro ao conectar com o servidor "+error);
        }

        setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white px-4">
      <form
        onSubmit={handleLogin}
        className="bg-neutral-800 p-6 sm:p-10 rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md"
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">
          Painel Administrativo
        </h2>

        <input
          type="text"
          placeholder="Usuário"
          className="w-full mb-4 p-3 rounded bg-neutral-700 outline-none border border-transparent focus:border-emerald-500 transition"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          className="w-full mb-6 p-3 rounded bg-neutral-700 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 p-3 rounded font-semibold transition disabled:opacity-50"
            >
            {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}