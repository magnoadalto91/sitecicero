import React, { useEffect, useState } from "react";
import PropertyCard from "../components/PropertyCard";

function Properties() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/properties`)
      .then(res => res.json())
      .then(data => setProperties(data.data));
  }, []);

  return (
    <div>

      <h1 className="text-2xl sm:text-4xl font-bold mb-6 sm:mb-8">
        Imóveis Disponíveis
      </h1>

      {properties.length === 0 ? (
        <div className="bg-slate-900 p-6 sm:p-10 rounded-xl text-slate-400 text-center">
          Nenhum imóvel cadastrado ainda.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-8">
          {properties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}

    </div>
  );
}

export default Properties;