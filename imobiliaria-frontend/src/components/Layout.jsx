import { useState } from "react";
import { Link } from "react-router-dom";

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-neutral-950 text-white min-h-screen">

      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 bg-black/60 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-6 py-4">

          <Link to="/" className="text-lg md:text-xl font-bold tracking-wide">
            CICERO IMÓVEIS
          </Link>

          {/* Botão mobile */}
          <button
            className="md:hidden text-2xl w-10 h-10 flex items-center justify-center rounded-lg active:bg-white/10 transition"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {menuOpen ? "✕" : "☰"}
          </button>

          {/* Menu desktop */}
          <nav className="hidden md:flex gap-8 text-sm">
            <Link to="/" className="hover:text-emerald-400 transition">
              Home
            </Link>
            <Link to="/imoveis" className="hover:text-emerald-400 transition">
              Imóveis
            </Link>
            <Link to="/login" className="hover:text-emerald-400 transition">
              Admin
            </Link>
          </nav>
        </div>

        {/* Menu mobile */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/10 px-4 py-4 flex flex-col bg-black/90">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="py-3 hover:text-emerald-400 transition border-b border-white/5"
            >
              Home
            </Link>
            <Link
              to="/imoveis"
              onClick={() => setMenuOpen(false)}
              className="py-3 hover:text-emerald-400 transition border-b border-white/5"
            >
              Imóveis
            </Link>
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="py-3 hover:text-emerald-400 transition"
            >
              Admin
            </Link>
          </div>
        )}
      </header>

      {/* Espaço da navbar */}
      <div className="pt-20 md:pt-24 px-4 md:px-0">
        {children}
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-16 sm:mt-20 py-6 sm:py-8 text-center text-sm text-gray-400 px-4">
        © 2026 Cicero Imóveis • Todos os direitos reservados
      </footer>
    </div>
  );
}