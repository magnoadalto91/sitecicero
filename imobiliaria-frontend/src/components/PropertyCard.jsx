import React from "react";
import { useNavigate } from "react-router-dom";

function PropertyCard({ property }) {
  const navigate = useNavigate();

  const imageUrl =
    property.images?.[0] ||
    "https://via.placeholder.com/600x400?text=Sem+Imagem";

  return (
    <div
      onClick={() => navigate(`/imovel/${property.id}`)}
      className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg transition transform active:scale-[0.98] md:hover:scale-[1.03] cursor-pointer"
    >
      <div className="w-full aspect-[4/3] overflow-hidden">
        <img
          src={imageUrl}
          alt={property.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-bold text-white truncate">
          {property.title}
        </h2>

        <p className="text-slate-400 mt-1 text-sm md:text-base">
          {property.city}
        </p>

        <p className="text-emerald-500 text-base md:text-lg font-bold mt-3">
          R$ {property.price?.toLocaleString("pt-BR")}
        </p>
      </div>
    </div>
  );
}

export default PropertyCard;