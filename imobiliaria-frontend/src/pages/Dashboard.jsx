import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white px-4">
        <div className="bg-neutral-900 p-6 sm:p-8 rounded-2xl text-center shadow-lg max-w-md w-full">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Acesso restrito
          </h2>
          <p className="text-neutral-400 text-sm mb-6">
            Você precisa estar autenticado para acessar o painel.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded-lg font-semibold transition w-full"
          >
            Ir para Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 md:px-8 py-8 md:py-12 text-white">
      <h1 className="text-xl sm:text-2xl md:text-4xl font-bold mb-6 sm:mb-8">
        Dashboard Administrativo
      </h1>

      <div className="bg-neutral-900 p-5 sm:p-6 md:p-8 rounded-2xl shadow-lg">
        <p className="text-neutral-300">
          Login realizado com sucesso 🎉
        </p>
      </div>
    </div>
  );
}

export default Dashboard;