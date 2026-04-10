import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[calc(100vh-96px)] w-full overflow-hidden">

      {/* IMAGEM FUNDO */}
      <img
        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
        className="absolute inset-0 w-full h-full object-cover scale-105"
        alt="Casa moderna"
        loading="eager"
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-b sm:bg-gradient-to-r from-black/85 via-black/70 to-black/40" />

      {/* CONTEÚDO */}
      <div className="relative z-10 flex flex-col justify-center min-h-[calc(100vh-96px)] max-w-7xl mx-auto px-4 sm:px-6 text-white py-12 sm:py-16">

        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight max-w-3xl">
          Encontre o imóvel que redefine seu padrão
        </h1>

        <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-slate-300 max-w-xl">
          Curadoria exclusiva de casas, apartamentos e propriedades premium.
        </p>

        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">

          <button
            onClick={() => navigate("/imoveis")}
            className="bg-emerald-600 hover:bg-emerald-700 transition px-8 py-4 rounded-xl text-base md:text-lg font-bold shadow-xl w-full sm:w-auto"
          >
            Explorar Imóveis
          </button>

          <button
            onClick={() => navigate("/login")}
            className="border border-white/40 hover:border-white px-8 py-4 rounded-xl text-base md:text-lg transition w-full sm:w-auto"
          >
            Área Administrativa
          </button>

        </div>

      </div>
    </section>
  );
}

export default Home;