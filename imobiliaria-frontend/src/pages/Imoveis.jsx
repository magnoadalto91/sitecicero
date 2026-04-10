import { useEffect, useState } from "react";
import PropertyCarousel from "../components/PropertyCarousel";
import { useNavigate } from "react-router-dom";

export default function Imoveis() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState({
    city: "",
    type: "",
    purpose: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchProperties();
    }, 400);

    return () => clearTimeout(delay);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page]);

  async function fetchProperties() {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (filters.city) params.append("city", filters.city);
      if (filters.type) params.append("type", filters.type);
      if (filters.purpose) params.append("purpose", filters.purpose);

      params.append("page", page);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/properties?${params.toString()}`
      );

      const result = await response.json();

      console.log("API RESULT:", result);

      if (Array.isArray(result)) {
        setProperties(result);
        setTotal(result.length);
      } else if (Array.isArray(result.data)) {
        setProperties(result.data);
        setTotal(result.total ?? result.data.length);
      } else {
        setProperties([]);
        setTotal(0);
      }

    } catch (error) {
      console.error("Erro ao buscar imóveis:", error);
      setProperties([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
        Carregando imóveis...
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(total / 10));

  return (
    <div className="min-h-screen bg-neutral-950 text-white px-4 sm:px-6 py-12 sm:py-20">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-2xl sm:text-4xl font-bold mb-6 sm:mb-12">
          Imóveis Disponíveis
        </h1>

        <p className="text-neutral-400 mb-6 sm:mb-8">
          {total} {total === 1 ? "imóvel encontrado" : "imóveis encontrados"}
        </p>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">

          {/* FILTROS */}
          <aside className="w-full lg:w-72 bg-neutral-900 p-4 sm:p-6 rounded-2xl h-fit lg:sticky lg:top-24 lg:self-start">
            <h2 className="text-xl font-semibold mb-4 sm:mb-6">
              Buscar imóveis
            </h2>

            <input
              type="text"
              placeholder="Cidade"
              className="w-full mb-3 sm:mb-4 p-2 bg-neutral-800 rounded"
              value={filters.city}
              onChange={(e) => {
                setPage(1);
                setFilters({ ...filters, city: e.target.value });
              }}
            />

            <select
              className="w-full mb-3 sm:mb-4 p-2 bg-neutral-800 rounded"
              value={filters.type}
              onChange={(e) => {
                setPage(1);
                setFilters({ ...filters, type: e.target.value });
              }}
            >
              <option value="">Tipo</option>
              <option value="Casa">Casa</option>
              <option value="Apartamento">Apartamento</option>
            </select>

            <select
              className="w-full mb-4 sm:mb-6 p-2 bg-neutral-800 rounded"
              value={filters.purpose}
              onChange={(e) => {
                setPage(1);
                setFilters({ ...filters, purpose: e.target.value });
              }}
            >
              <option value="">Finalidade</option>
              <option value="Venda">Venda</option>
              <option value="Aluguel">Aluguel</option>
            </select>

            <button
              onClick={() => {
                setPage(1);
                setFilters({ city: "", type: "", purpose: "" });
              }}
              className="w-full mt-2 sm:mt-3 border border-neutral-700 py-2 rounded-lg hover:bg-neutral-800 transition"
            >
              Limpar filtros
            </button>
          </aside>

          {/* LISTAGEM */}
          <main className="flex-1">

            {properties.length === 0 ? (
              <p className="text-neutral-400">
                Nenhum imóvel encontrado.
              </p>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-8">
                  {properties.map((property) => (
                    <div
                      key={property.id}
                      className="bg-neutral-900 rounded-2xl overflow-hidden shadow-xl hover:scale-[1.02] transition duration-300"
                    >
                      <div
                        onClick={() => navigate(`/imovel/${property.id}`)}
                        className="h-52 sm:h-64 bg-neutral-800 cursor-pointer"
                      >
                        <PropertyCarousel
                          images={property.property_images || []}
                        />
                      </div>

                      <div className="p-4 sm:p-6">
                        <h2 className="text-lg sm:text-xl font-semibold mb-2">
                          {property.title}
                        </h2>

                        <p className="text-neutral-400 text-sm mb-3 sm:mb-4">
                          {property.city}
                        </p>

                        <div className="flex justify-between text-sm text-neutral-400 mb-3 sm:mb-4">
                          <span>{property.bedrooms} quartos</span>
                          <span>{property.bathrooms} banheiros</span>
                          <span>{property.area} m²</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-emerald-500 font-bold text-base sm:text-lg">
                            R$ {property.price?.toLocaleString("pt-BR")}
                          </span>

                          <span className="text-xs bg-neutral-800 px-3 py-1 rounded-full">
                            {property.purpose}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center items-center gap-4 mt-10 sm:mt-16">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-4 py-2 bg-neutral-800 rounded disabled:opacity-40"
                  >
                    Anterior
                  </button>

                  <span className="text-sm sm:text-base">
                    Página {page} de {totalPages}
                  </span>

                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-2 bg-neutral-800 rounded disabled:opacity-40"
                  >
                    Próxima
                  </button>
                </div>
              </>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}