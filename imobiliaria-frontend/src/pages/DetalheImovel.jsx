import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import PropertyCarousel from "../components/PropertyCarousel";

export default function DetalheImovel() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperty() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/properties/${id}`
        );

        const data = await response.json();
        setProperty(data);
      } catch (error) {
        console.error("Erro ao buscar imóvel:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
        Carregando imóvel...
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
        Imóvel não encontrado
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white py-10 sm:py-14 md:py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">

        <PropertyCarousel images={property.property_images} />

        <div className="mt-6 sm:mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">

          {/* Informações */}
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              {property.title}
            </h1>

            <p className="text-neutral-400 mb-4 sm:mb-6">
              {property.city}
            </p>

            <p className="text-neutral-300 leading-relaxed text-sm md:text-base">
              {property.description}
            </p>
          </div>

          {/* Card lateral */}
          <div className="bg-neutral-900 p-5 sm:p-6 md:p-8 rounded-2xl shadow-lg h-fit">
            <div className="text-2xl sm:text-3xl text-emerald-500 font-bold mb-4 sm:mb-6">
              R$ {Number(property.price).toLocaleString("pt-BR")}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-0 sm:space-y-3 text-neutral-300 text-sm md:text-base">
              <p>Quartos: {property.bedrooms}</p>
              <p>Banheiros: {property.bathrooms}</p>
              <p>Área: {property.area} m²</p>
              <p>Finalidade: {property.purpose}</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}